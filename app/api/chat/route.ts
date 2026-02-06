import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Raindrop } from '@raindrop-ai/browser-sdk';

export const runtime = 'edge';

const rd = new Raindrop({ apiKey: process.env.RAINDROP_WRITE_KEY! });

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json();
  const convoId = conversationId || crypto.randomUUID();

  // Get the last user message as input
  const userMessages = messages.filter((m: { role: string }) => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';

  // Track streaming response with Raindrop
  const eventId = crypto.randomUUID();
  let fullResponse = '';
  let isFirstChunk = true;
  let partialTracker: Awaited<ReturnType<typeof rd.trackAiPartial>> | null = null;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    onChunk: async ({ chunk }) => {
      if (chunk.type === 'text-delta') {
        fullResponse += chunk.textDelta;

        if (isFirstChunk) {
          isFirstChunk = false;
          partialTracker = await rd.trackAiPartial({
            eventId,
            event: 'chat',
            model: 'gpt-4o-mini',
            convoId,
            input: lastUserMessage,
            output: chunk.textDelta,
          });
        } else if (partialTracker) {
          await rd.trackAiPartial({ eventId, output: chunk.textDelta });
        }
      }
    },
    onFinish: async () => {
      if (partialTracker) {
        await partialTracker.finish({ output: fullResponse });
      }
    },
  });

  const stream = result.toDataStream();

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Conversation-Id': convoId,
    },
  });
}
