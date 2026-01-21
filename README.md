# Simple Vercel AI Chat

A simple chat application built with Next.js 14+, Vercel AI SDK, and OpenAI's GPT-4o-mini model.

## Features

- Real-time streaming chat responses
- Conversation management with message history
- Clean and responsive UI with Tailwind CSS
- Built with TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

### Setup

First, set up your environment variables:

1. Add your OpenAI API key to `.env.local`:
```bash
OPENAI_API_KEY=your-actual-api-key-here
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start chatting with the AI assistant.

## Project Structure

- `app/page.tsx` - Main page component
- `app/api/chat/route.ts` - API endpoint for chat with streaming
- `components/Chat.tsx` - Chat UI component with conversation management

## How It Works

The application uses the Vercel AI SDK's `useChat` hook for conversation management and streaming responses. Messages are sent to the `/api/chat` endpoint, which uses the AI SDK to stream responses from OpenAI's GPT-4o-mini model.

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI integration
- [OpenAI GPT-4o-mini](https://openai.com/) - Language model
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
