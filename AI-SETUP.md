# VictorianHelper — connecting the AI writing engine

The site is prepared to use a real language model, but the AI connection is **not live yet**. The public GitHub Pages site cannot safely hold a private API key. This guide is for a parent, guardian or teacher to set up the server side and manage any account or spending.

## What is already in this repository

- `index.html` has an AI connection setting called `AI_EXPAND_ENDPOINT`.
- `worker.js` is a Cloudflare Worker example. It sends the student's text to the OpenAI Responses API and returns the expanded paragraph.
- The Worker keeps the API key on the server, accepts requests only from the published VictorianHelper site, limits input length, limits output length, and asks the model not to invent facts or return generic advice.
- The Worker sends `store: false` in its API request. This is a request setting, not a promise that no service-side operational or safety logs can ever exist.

## Adult setup is required

A parent/guardian or teacher should own and supervise the AI provider account, billing, Cloudflare account, and deployment. Do not create an API account, add payment details, or handle a private API key yourself.

## Setup overview for the adult

1. Create or use an adult-managed Cloudflare account and open **Workers & Pages**.
2. Create a Worker (for example, name it `victorianhelper-ai`).
3. Paste the contents of this repository's `worker.js` into the Worker editor and deploy it.
4. In the Worker settings, open **Settings → Variables and Secrets**. Add a **Secret** named `VICCY_API_KEY` and enter the API key there. Do not put this key into GitHub, `index.html`, or any browser code.
5. Add a plain-text variable named `OPENAI_MODEL` with value `gpt-5.4-mini`. The model can be changed later by the adult managing the service.
6. Deploy the Worker again after changing settings, and copy its public Worker URL.
7. In `index.html`, replace the empty string in `const AI_EXPAND_ENDPOINT = ''; ` with the Worker URL, for example `https://victorianhelper-ai.<adult-managed-subdomain>.workers.dev`. The URL is public; the API key is not.
8. Commit that small change to the `main` branch. The GitHub Pages site will then call the Worker when the student chooses **Expand & enrich writing**.

Official guidance:
- OpenAI says API keys must not be exposed in browser code and should be kept on a backend: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- Cloudflare explains how to add a Worker Secret: https://developers.cloudflare.com/workers/configuration/secrets/
- OpenAI Responses API reference: https://developers.openai.com/api/reference/resources/responses/methods/create

## Important before making it public

The Worker checks the browser Origin header, but Origin checks alone are **not** a complete protection against automated requests or someone calling the endpoint outside a browser. Before public use, the adult managing the Worker should add Cloudflare rate limiting and usage monitoring, set a spending limit with the AI provider where available, and test the setup. Do not publish the API key or commit it to this repository. If the endpoint is abused, disable or rotate the key.

## Privacy

When the AI connection is enabled, text is sent to the Worker and then to the AI provider when the student clicks the expansion button. The local grammar checker still runs in the browser. Students should not paste passwords, addresses, private family details, or other sensitive personal information into the writing box.

## How to test

Try different inputs after the adult has connected the Worker:

- `pizza`
- `A storm was approaching the village.`
- `I think school gardens are useful because students can learn outside.`
- A paragraph from a story or an explanation written for school.

Check whether the returned writing is specific, relevant, age-appropriate and factually sensible. AI can still make mistakes; it is a writing assistant, not a guarantee of correctness.


## Victorian knowledge library

The repository now includes a student-facing page at `victorian-library.html`, linked from the homepage. It introduces 20 key themes, gives a short timeline, and links to museum and archive sources:
- English Heritage — Victorian England and teaching resources
- The National Archives — Victorian Lives primary sources
- Historical Association — Victorian Britain overview
- London Museum — life in Victorian London
- Victoria and Albert Museum — Victorian clothing
- British Library — literature resources

The Worker instructions now give Viccy a Victorian-history specialist focus, including reminders to compare different people's experiences, include Ireland and the wider Empire carefully, distinguish the period's dates, and avoid inventing historical evidence.

**Important limitation:** the knowledge-library links are research links for the student. The Worker does not automatically read or browse those websites. The AI can use its existing model knowledge and the Victorian guidance in its instructions, but important historical details should still be checked against the linked sources. The AI feature also remains inactive until an adult deploys the Worker and adds the secret `VICCY_API_KEY`.
