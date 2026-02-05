import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Raindrop } from 'raindrop-ai';

const raindrop = new Raindrop({
  writeKey: process.env.RAINDROP_WRITE_KEY!,
  wizardSession: '01b50d8b-9072-4a5c-9196-004e5cb512a4',
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const userMessage = messages[messages.length - 1]?.content || '';

  const interaction = raindrop.begin({
    eventId: crypto.randomUUID(),
    event: 'chat_message',
    userId: 'anonymous',
    input: userMessage,
    model: 'gpt-4o-mini',
  });

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  const response = result.toDataStreamResponse();

  // Capture output in background without blocking the response
  result.text.then((text) => {
    interaction.finish({ output: text });
  });

  return response;
}
