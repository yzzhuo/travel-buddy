import OpenAI from 'openai';
import {
  OpenAIStream,
  StreamingTextResponse,
} from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    response_format: { "type": "json_object" },
    messages: [
      { role: "system", content: "You are a helpful assistant help user to discover and plan their trip." },
      { role: "user", content: prompt },
    ],
  });

  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
