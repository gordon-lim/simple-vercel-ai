import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import raindrop from 'raindrop-ai/otel';

export const runtime = 'nodejs';

// Generate a unique user ID for this session
// In production, this should come from your authentication system
const generateUserId = () => {
  return `user_${crypto.randomUUID()}`;
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Generate unique identifiers for tracking
  const userId = generateUserId();
  const convoId = `convo_${crypto.randomUUID()}`;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'chat',
      metadata: {
        ...raindrop.metadata({
          userId,
          eventName: 'chat_completion',
          convoId,
        }),
      },
    },
  });

  return new StreamingTextResponse(result.toAIStream());
}
