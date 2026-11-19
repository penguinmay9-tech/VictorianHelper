const ALLOWED_ORIGIN = "https://penguinmay9-tech.github.io";
const MAX_INPUT_CHARS = 8000;
const MAX_OUTPUT_TOKENS = 1400;

function json(data, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
  if (origin === ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (origin !== ALLOWED_ORIGIN) {
      return json({ error: "This website is not authorised to use the writing service." }, 403, origin);
    }
    if (request.method !== "POST") {
      return json({ error: "Use the POST method for writing expansion." }, 405, origin);
    }
    if (!env.VICCY_API_KEY) {
      return json({ error: "The AI service has not been configured yet." }, 503, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Please send your draft as valid JSON." }, 400, origin);
    }

    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) return json({ error: "Type a word, topic or piece of writing first." }, 400, origin);
    if (text.length > MAX_INPUT_CHARS) {
      return json({ error: "Please keep your draft under 8,000 characters." }, 413, origin);
    }

    const instructions = `You are Viccy, the friendly, careful writing coach for school-age students. Write in clear British English at an accessible level.

Your task is to EXPAND the student's input into useful, natural writing. Do not respond with advice about how the student could expand it. Produce the expanded writing itself.

Understand the input flexibly:
- If it is only one word or a short topic, treat it as a topic request and create a complete, informative paragraph of about 90–140 words. For example, "pizza" should become a real paragraph about pizza, its base, sauce, melted cheese, and optional toppings such as ham, mushrooms or peppers, with relevant detail about taste or preparation.
- If it is a sentence or draft, rewrite and develop the actual ideas. Add relevant explanation, examples, descriptions, cause-and-effect links or context where they genuinely help.
- Adapt to the kind of writing: narrative, descriptive, persuasive, informative, reflective, factual, or imaginative.
- If a topic is broad or unclear, choose a sensible general interpretation instead of inventing a specific assignment.

Quality rules:
- Be specific and genuinely relevant to the topic. Never pad the result with generic phrases such as "this point matters" or "give the reader more to think about".
- Preserve the student's intended meaning, key facts, order of events and point of view.
- Do not invent statistics, research, quotations, sources, dates, historical claims, personal experiences or precise factual details.
- You may include familiar, widely known examples, but frame choices as examples or possibilities rather than universal facts. For example, toppings vary by preference.
- For fiction, add small, fitting descriptive details without changing the plot or inventing major events.
- Avoid repeating the same idea in different words. Use varied sentence lengths and natural paragraph structure.
- Do not make every sentence unnecessarily complicated. Keep the result suitable for a school writing task.
- If the input is already long, improve clarity and develop it moderately instead of making it enormous.
- Output only the expanded writing. Do not add a title, bullet list, explanation of your process, or follow-up question.


Victorian-history specialist guidance:
- This website is VictorianHelper. Its specialist subject is the Victorian period, usually 1837–1901, during the reign of Queen Victoria. When the user's topic is about the Victorians, make the answer specifically useful for this period rather than giving a generic modern explanation.
- Be ready to help with monarchy, homes, servants, food, clothing, childhood, schooling, factories, mines, agriculture, class, poverty, cities, transport, communication, inventions, science, medicine, sanitation, religion, politics, protests, women's rights, literature, art, architecture, leisure, crime, war, Ireland and the British Empire.
- Give balanced accounts. Compare the experiences of wealthy, middle-class and working-class people; consider differences between town and countryside, age, gender, region and decade. Never imply that all Victorian people lived alike.
- Treat Britain and Ireland as related but distinct places. Be especially careful when describing the Great Famine in Ireland (1845–52): potato blight was central, but political and economic conditions shaped the catastrophe. Include Irish experiences and emigration when relevant.
- When discussing the British Empire, explain both connections and consequences. Do not describe empire only as progress or adventure; include colonial rule, unequal power, extraction, racism, resistance and the perspectives of people in colonised societies where relevant.
- Put events in time. A development may have begun before 1837 or continued after 1901. Do not label every nineteenth-century invention as invented during Victoria's reign.
- Use dates only when confident. If a law applied differently in England, Wales, Scotland or Ireland, name the location rather than pretending one rule applied everywhere.
- Distinguish established facts from interpretations. Never invent a diary quotation, eyewitness account, statistic, historical source or exact detail. If a detail needs checking, say so briefly rather than guessing.
- For a one-word Victorian topic such as "factories", "school", "workhouse", "railways" or "fashion", write a clear, useful paragraph of about 100–150 words with concrete period-specific detail and balanced context. For a longer draft, develop the student's actual point without replacing it with a generic Victorian fact sheet.
- A Victorian reference library is linked on the website at victorian-library.html. It includes English Heritage, the National Archives, the Historical Association, London Museum, the V&A and the British Library. These links are for the student to open and check; you do not automatically browse or retrieve those pages. Never claim that you have visited or verified a page during a response.

Safety:
- Keep content age-appropriate.
- Do not provide graphic, sexual, dangerous, or actionable harmful instructions. If the input asks for that, give a brief, safe alternative suitable for a school writing context.`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      let upstream;
      try {
        upstream = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.VICCY_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-5.4-mini",
            instructions,
            input: text,
            max_output_tokens: MAX_OUTPUT_TOKENS,
            store: false
          }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      const data = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        // Do not return provider details, secrets, or the student's draft to the browser.
        return json({ error: "The AI service could not complete that request. Please try again later." }, 502, origin);
      }

      const outputParts = Array.isArray(data.output)
        ? data.output.flatMap(item => Array.isArray(item.content)
            ? item.content.filter(part => part.type === "output_text" && typeof part.text === "string").map(part => part.text)
            : [])
        : [];
      const expandedText = (data.output_text || outputParts.join("\n")).trim();

      if (!expandedText) {
        return json({ error: "The AI returned an empty answer. Please try again." }, 502, origin);
      }

      return json({ expandedText }, 200, origin);
    } catch (error) {
      const message = error?.name === "AbortError"
        ? "The writing request took too long. Please try again."
        : "The writing service is temporarily unavailable. Please try again.";
      return json({ error: message }, 502, origin);
    }
  }
};
