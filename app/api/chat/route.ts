import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import raindrop from 'raindrop-ai/otel';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'chat',
      metadata: {
        ...raindrop.metadata({
          userId: 'anonymous',
        }),
      },
    },
  });

  return result.toDataStreamResponse();
}
