import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai";

import { INSTRUCTIONS, MODEL, tools, type ChatMessage } from "@/lib/assistant";

export async function POST(request: Request) {
  const body = await request.json();
  const messages = await validateUIMessages<ChatMessage>({ messages: body.messages, tools });

  const result = streamText({
    model: MODEL,
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    tools,
    // One step calls the tool, the next answers from its result.
    stopWhen: isStepCount(3),
    // The model reasons before it answers, and reasoning counts toward the cap.
    maxOutputTokens: 1000,
  });

  const generationIds: string[] = [];

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      messageMetadata: ({ part }) => {
        if (part.type !== "finish-step") return;
        const id = part.providerMetadata?.gateway?.generationId;
        if (typeof id === "string") generationIds.push(id);
        return { generationIds: [...generationIds] };
      },
      // The browser gets a generic message; the reason goes to the server log.
      onError: (error) => {
        console.error(error);
        return "An error occurred.";
      },
    }),
  });
}
