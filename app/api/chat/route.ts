import { streamText } from 'ai';
import { xai } from '@ai-sdk/xai'
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google'; 
import { anthropic } from '@ai-sdk/anthropic';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from "convex/browser";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  let modelProvider;
  const { messages, selectedModel } = await req.json();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');
  const category = await client.query(api.models.getCategoryByModelId, { modelId: selectedModel });

  if (!category) return new Response('Invalid model id', { status: 404 });
  if (category === "Anthropic") modelProvider = anthropic(selectedModel);
  else if (category === "OpenAI") modelProvider = openai(selectedModel);
  else if (category === "Google") modelProvider = google(selectedModel);
  else if (category === "XAI") modelProvider = xai(selectedModel);
  else return new Response('Unsupported model', { status: 400 });

  const result = streamText({
    model: modelProvider,
    messages,
    abortSignal: req.signal,
    onError: (error) => {
      console.error('Error during streaming:', error);
    }
  });

  return result.toDataStreamResponse();
}