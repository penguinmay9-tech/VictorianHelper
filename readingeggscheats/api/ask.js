const crypto = require("node:crypto");

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 4;
const MAX_IMAGE_CHARS = 1_250_000;

function errorResponse(res, status, message) {
  return res.status(status).json({ error: message });
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function overLimit(ip) {
  const now = Date.now();
  const store = globalThis.__readingEggsLimits || (globalThis.__readingEggsLimits = new Map());
  const record = store.get(ip);

  if (!record || now - record.started >= WINDOW_MS) {
    store.set(ip, { started: now, count: 1 });
    return false;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;
  record.count += 1;
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return errorResponse(res, 405, "Use a POST request.");
  }

  const expectedAccessCode = process.env.READINGEGGS_ACCESS_CODE;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!expectedAccessCode || !apiKey || !model) {
    return errorResponse(res, 503, "The AI helper has not been configured by the adult site manager yet.");
  }

  const auth = String(req.headers.authorization || "");
  const suppliedAccessCode = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!safeEqual(suppliedAccessCode, expectedAccessCode)) {
    return errorResponse(res, 401, "That access code was not recognised.");
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return errorResponse(res, 403, "Requests must come from the ReadingEggsCheats website.");
      }
    } catch {
      return errorResponse(res, 403, "The request origin could not be verified.");
    }
  }

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (overLimit(ip)) {
    return errorResponse(res, 429, "You have reached the short-term request limit. Try again later.");
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return errorResponse(res, 400, "The request was not valid JSON."); }
  }
  if (!body || typeof body !== "object") {
    return errorResponse(res, 400, "The request was empty.");
  }

  const lesson = Number(body.lesson);
  const activity = Number(body.activity);
  const story = typeof body.story === "string" ? body.story.slice(0, 16000) : "";
  const questions = Array.isArray(body.questions)
    ? body.questions.slice(0, 16).map((q, index) => ({
        number: Number(q && q.number) || index + 1,
        question: typeof (q && q.question) === "string" ? q.question.slice(0, 700) : "",
        attempt: typeof (q && q.attempt) === "string" ? q.attempt.slice(0, 500) : ""
      }))
    : [];
  const images = Array.isArray(body.images) ? body.images.slice(0, 3) : [];

  if (!Number.isInteger(lesson) || lesson < 61 || lesson > 100 || activity !== 1) {
    return errorResponse(res, 400, "Choose a lesson from 61 to 100 and Activity 1.");
  }
  if (!story.trim() && !questions.some(q => q.question) && images.length === 0) {
    return errorResponse(res, 400, "Add story text, questions or screenshots first.");
  }

  for (const image of images) {
    if (
      typeof image !== "string" ||
      image.length > MAX_IMAGE_CHARS ||
      !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(image)
    ) {
      return errorResponse(res, 400, "A screenshot is too large or uses an unsupported image type. Use PNG, JPG or WEBP images under 900 KB each.");
    }
  }

  const typedQuestions = questions
    .filter(q => q.question || q.attempt)
    .map(q =>
      "Question " + q.number + ": " + (q.question || "[question not typed]") +
      (q.attempt ? "\nStudent's attempt: " + q.attempt : "")
    )
    .join("\n\n");

  const userContent = [
    {
      type: "input_text",
      text:
        "Reading Eggspress study material supplied for Lesson " + lesson + ", Activity 1.\n\n" +
        "Story text (if supplied):\n" + (story.trim() || "[No story text typed; inspect screenshots.]") +
        "\n\nQuestions and attempts (if typed):\n" + (typedQuestions || "[No questions typed; inspect screenshots.]")
    }
  ];

  for (const image of images) {
    userContent.push({ type: "input_image", image_url: image, detail: "high" });
  }

  const instructions = [
    "You are a patient reading-comprehension tutor for a school student.",
    "Read the supplied story, questions and screenshots carefully.",
    "For every question you can clearly identify, provide the question number, a concise suggested answer, a short piece of evidence from the story, and a simple explanation of how the evidence supports the answer.",
    "If the student supplied an attempt, explain whether it is supported by the story and why.",
    "Use only the material provided. Do not invent story details or questions. Do not guess at blurry or cut-off text; say when you cannot read something.",
    "If fewer than 16 questions are visible or supplied, answer only those you can identify and list the missing question numbers that need clearer screenshots or typed text.",
    "Use age-appropriate, student-friendly language and help the student understand how to find evidence.",
    "Do not reproduce the full story or large sections of it."
  ].join(" ");

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input: [{ role: "user", content: userContent }],
        max_output_tokens: 2500,
        store: false
      }),
      signal: AbortSignal.timeout(50000)
    });

    const result = await aiResponse.json().catch(() => ({}));
    if (!aiResponse.ok) {
      return errorResponse(
        res,
        aiResponse.status === 429 ? 429 : 502,
        "The AI service could not complete that request. Ask the site manager to check the AI account and model setting."
      );
    }

    const outputText = (result.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text" && typeof part.text === "string")
      .map(part => part.text)
      .join("\n")
      .trim();

    const answer = outputText || (typeof result.output_text === "string" ? result.output_text.trim() : "");
    if (!answer) {
      return errorResponse(res, 502, "The AI did not return an explanation. Try clearer screenshots or paste the question text.");
    }

    return res.status(200).json({ answer });
  } catch (err) {
    const timedOut = err && (err.name === "TimeoutError" || err.name === "AbortError");
    return errorResponse(
      res,
      timedOut ? 504 : 502,
      timedOut ? "The AI took too long to respond. Try fewer or clearer screenshots." : "Could not connect to the AI service."
    );
  }
};
