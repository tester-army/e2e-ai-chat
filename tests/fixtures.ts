// The chat's model and the e2e agent both go through the Vercel AI Gateway.
export const skip =
  process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
    ? false
    : "set AI_GATEWAY_API_KEY to run the chat tests";

// The chat route streams each step's AI Gateway generation id as message metadata (`data: {...}` lines).
export function generationIds(body: string): string[] {
  const chunks = body
    .split("\n")
    .filter((line) => line.startsWith("data: {"))
    .map((line) => JSON.parse(line.slice("data: ".length)));
  return chunks.findLast((chunk) => chunk.messageMetadata?.generationIds)?.messageMetadata.generationIds ?? [];
}
