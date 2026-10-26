import { Chat } from "@/components/chat";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-300 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-20">
        <div>
          <h1 className="type-h1 text-e2e-text-primary">
            AI chat,
            <br />
            tested end to end
          </h1>
          <p className="mt-4 max-w-120 type-body text-e2e-text-secondary">
            A support assistant that answers with a real model through the AI SDK, tested with e2e: each reply is judged
            for what it means, not its exact words.
          </p>
          <p className="mt-8 type-code-s text-e2e-text-faint">
            Try &ldquo;Where is order E2E-1002?&rdquo;, or ask about shipping and returns.
          </p>
        </div>

        <Chat />
      </div>
    </main>
  );
}
