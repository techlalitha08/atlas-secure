This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Setup

Add your API keys to a local environment file named .env.local in the project root.

Example:

```env
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here
DEEPFAKE_MODEL_ID=aifaishr/deepfake-detection
```

Place the VirusTotal key in the VIRUSTOTAL_API_KEY variable. The app reads it from the server-side environment in the malware route.

## Atlas as a real AI orchestrator

Atlas now delegates requests to specialist agents instead of answering directly. The routing logic lives in [lib/orchestrator.ts](lib/orchestrator.ts) and currently supports:

- Website Agent
- Deepfake Agent
- QR Agent
- Malware Agent

The main API route at [app/api/atlas-secure/route.ts](app/api/atlas-secure/route.ts) sends each request through the orchestrator, collects the specialist analysis, and returns one unified Atlas response.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
