# ReadingEggsCheats — AI setup

The website has two parts:

- `index.html`: the lesson picker, screenshot uploader, 16 question boxes and saved lesson guides.
- `api/ask.js`: a server-side AI endpoint that reads the supplied text and screenshots and returns explanations.

## Important: the AI is not live until an adult configures hosting

GitHub Pages can serve the HTML, but it cannot run the server-side `api/ask.js` function. The AI-enabled version must be deployed together with its server function on a host that supports Node.js serverless functions.

An adult site manager should:

1. Import the GitHub repository `penguinmay9-tech/VictorianHelper` into Vercel.
2. Set the Vercel **Root Directory** to `readingeggscheats`. Choose the **Other** framework preset. The project root must contain `index.html` and the `api` folder.
3. In Vercel Project Settings → Environment Variables, set these values for the Production environment:
   - `OPENAI_API_KEY`: the private API key for the AI service. Keep it only in the hosting provider's encrypted environment variables. Never put it in this repository, the HTML, or a browser screenshot.
   - `OPENAI_MODEL`: the name of a vision-capable model enabled for the API account.
   - `READINGEGGS_ACCESS_CODE`: a new, private access code that the adult shares only with the intended user.
4. Redeploy after adding or changing environment variables.
5. Open the Vercel deployment URL (not the GitHub Pages URL) to use the AI button.

Vercel's official guides explain [importing a Git repository](https://vercel.com/docs/git), [selecting the Root Directory](https://vercel.com/docs/builds/configure-a-build#root-directory), and [setting environment variables](https://vercel.com/docs/environment-variables).

## Privacy and spending safeguards

- The API key and model name are read only by the server. They are not included in browser code.
- The student must enter the adult-managed access code before making an AI request. The code is not saved in local browser storage.
- The endpoint accepts up to three PNG, JPEG or WEBP screenshots, limited to 900 KB each, and up to 16 typed questions.
- The endpoint applies a small per-process request limit. This is a basic safeguard, not a complete billing limit; the adult should also set usage alerts and spending limits in the AI provider account where available.
- Screenshots and story text are sent to the AI provider when the student presses **Ask AI**. Do not upload screenshots showing names, account details, passwords, messages, or other personal information.
- The endpoint asks the AI to explain only the questions it can actually read, use evidence from the supplied story, and say when something is missing or blurry. It does not log the submitted story or images.
- Saved lesson guides use this browser's local storage. They are not automatically shared across devices.

The service uses the OpenAI Responses API with image inputs. See the [official Responses API reference](https://developers.openai.com/api/reference/resources/responses/methods/create) and [image input guide](https://developers.openai.com/api/docs/guides/images-vision).
