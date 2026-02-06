import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Raindrop } from '@raindrop-ai/browser-sdk';

export const runtime = 'edge';

const rd = new Raindrop({ apiKey: process.env.RAINDROP_WRITE_KEY! });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const convoId = crypto.randomUUID();
  const userMessage = messages[messages.length - 1]?.content ?? '';

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    async onFinish({ text }) {
      await rd.trackAi({
        event: 'chat',
        userId: 'anonymous',
        model: 'gpt-4o-mini',
        convoId,
        input: userMessage,
        output: text,
      });
    },
  });

  return result.toDataStreamResponse();
}
