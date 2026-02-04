import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Raindrop } from 'raindrop-ai';

const raindrop = new Raindrop({
  writeKey: process.env.RAINDROP_WRITE_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
  const input = lastUserMessage?.content || '';

  const interaction = raindrop.begin({
    eventId: crypto.randomUUID(),
    event: 'chat_message',
    userId: crypto.randomUUID(),
    convoId: crypto.randomUUID(),
    input,
    model: 'gpt-4o-mini',
  });

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    onFinish: ({ text }) => {
      interaction.finish({ output: text });
    },
  });

  return result.toDataStreamResponse();
}
