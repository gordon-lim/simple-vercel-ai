import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Raindrop } from '@raindrop-ai/browser-sdk';
import { after } from 'next/server';

export const runtime = 'edge';

console.log('[Raindrop] Initializing with API key:', process.env.RAINDROP_WRITE_KEY ? 'present' : 'MISSING');
const raindrop = new Raindrop({ apiKey: process.env.RAINDROP_WRITE_KEY!,
  wizardSession: '__WIZARD_SESSION_UUID__'
 });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const eventId = crypto.randomUUID();
  const convoId = crypto.randomUUID();
  const userMessage = messages[messages.length - 1]?.content || '';

  console.log('[Raindrop] POST request received');
  console.log('[Raindrop] eventId:', eventId);
  console.log('[Raindrop] convoId:', convoId);
  console.log('[Raindrop] userMessage:', userMessage);

  let finishPromise: Promise<void> | null = null;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    onFinish: async ({ text }) => {
      console.log('[Raindrop] onFinish called with text length:', text.length);
      console.log('[Raindrop] Calling trackAi...');
      finishPromise = raindrop.trackAi({
        eventId,
        event: 'chat',
        model: 'gpt-4o-mini',
        convoId,
        userId: 'anonymous',
        input: userMessage,
        output: text,
      }).then((response) => {
        console.log('[Raindrop] trackAi success:', JSON.stringify(response));
      }).catch((error) => {
        console.error('[Raindrop] trackAi error:', error);
      });
    },
  });

  after(async () => {
    console.log('[Raindrop] after() called, finishPromise:', finishPromise ? 'exists' : 'null');
    if (finishPromise) {
      await finishPromise;
      console.log('[Raindrop] finishPromise resolved');
    }
  });

  return result.toDataStreamResponse();
}
