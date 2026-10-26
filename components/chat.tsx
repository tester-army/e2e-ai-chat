"use client";

import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { useRef, useState, useSyncExternalStore, type SubmitEvent } from "react";

import { OutlineButton } from "@/components/ui/outline-button";
import type { ChatMessage } from "@/lib/assistant";

const SUGGESTIONS = ["Do I get free shipping on two T-shirts?", "Where is order E2E-1002?", "How do returns work?"];

export function Chat({ model }: { model: string }) {
  const { messages, sendMessage, regenerate, status, error } = useChat<ChatMessage>();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hydrated = useHydrated();
  const answering = status === "submitted" || status === "streaming";
  const empty = messages.length === 0;

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage({ text: input.trim() });
    setInput("");
  }

  function ask(suggestion: string) {
    sendMessage({ text: suggestion });
    // The suggestions go away, so keep the keyboard on the message box.
    inputRef.current?.focus();
  }

  // The message box keeps its place among the children, so it stays mounted (and focused) after the first message.
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {empty ? (
        <div className="mx-auto mt-auto w-full max-w-180 px-6 pb-8 text-center">
          <p className="type-eyebrow text-e2e-text-faint">e2e Store support</p>
          <h1 className="mt-3 type-h2 text-e2e-text-primary">How can we help?</h1>
          <p className="mx-auto mt-4 max-w-120 type-body text-e2e-text-secondary">
            A support chat on a real model, tested end to end with e2e: each reply is judged for what it means, not its
            exact words.
          </p>
        </div>
      ) : (
        // column-reverse keeps the view at the newest message while a reply streams in.
        <div className="flex flex-1 flex-col-reverse overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_2rem)]">
          <div className="mx-auto flex w-full max-w-180 flex-col gap-6 px-6 py-8">
            <ol aria-label="Conversation" className="flex flex-col gap-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </ol>
            {answering && (
              <p role="status" className="flex items-center gap-2 pl-11 type-code-s text-e2e-text-faint">
                <span aria-hidden="true" className="size-1.5 bg-e2e-text-faint motion-safe:animate-pulse" />
                Answering…
              </p>
            )}
            {error && (
              <div className="ml-11 grid grid-cols-[minmax(0,1fr)_96px] items-center gap-3 border border-e2e-accent px-4 py-3">
                <p role="alert" className="type-code-s text-e2e-accent">
                  Something went wrong. The assistant didn&apos;t answer.
                </p>
                <OutlineButton onClick={() => regenerate()}>Retry</OutlineButton>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mx-auto w-full max-w-180 px-6">
        <div className="flex items-center gap-2 border border-e2e-field-stroke bg-e2e-field-fill py-2 pr-2 pl-4 transition-[border-color,background-color] duration-200 focus-within:border-e2e-button-stroke focus-within:bg-e2e-panel-raised hover:border-e2e-white-50 motion-reduce:transition-none">
          <input
            ref={inputRef}
            aria-label="Message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            // A message typed before React hydrates would be lost.
            readOnly={!hydrated}
            // After an error, Retry sends the question again.
            disabled={error != null}
            placeholder="Ask the store a question"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent type-body text-e2e-text-bright caret-e2e-caret placeholder:text-e2e-text-faint focus:outline-none disabled:opacity-40"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || answering || error != null}
            className="grid size-10 shrink-0 place-items-center bg-e2e-button-fill-solid text-e2e-text-on-light transition-colors hover:bg-e2e-paper-0 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-e2e-button-stroke disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </form>

      {empty ? (
        <ul
          aria-label="Suggestions"
          className="mx-auto mb-auto flex w-full max-w-180 flex-wrap justify-center gap-2.5 px-6 pt-4"
        >
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => ask(suggestion)}
                // A tap before React hydrates would do nothing.
                disabled={!hydrated}
                className="flex h-10 items-center bg-e2e-chip-fill px-4 type-chip text-e2e-white-70 inset-ring-[0.5px] inset-ring-e2e-chip-stroke transition-[color,box-shadow] hover:text-e2e-white-90 hover:inset-ring-e2e-white-50 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-e2e-white-60 motion-reduce:transition-none"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="px-6 pt-3 pb-5 text-center type-code-s text-e2e-text-faint">{model} · Vercel AI Gateway</p>
    </main>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const text = message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");

  if (message.role === "user") {
    return (
      <li className="flex justify-end">
        <span className="sr-only">You: </span>
        <p className="max-w-[85%] bg-e2e-panel-raised px-4 py-2.5 type-body whitespace-pre-wrap text-e2e-text-bright">
          {text}
        </p>
      </li>
    );
  }

  return (
    <li className="flex gap-3">
      <Image
        src="/e2e/logo-white.png"
        alt=""
        width={168}
        height={168}
        sizes="32px"
        className="size-8 shrink-0 border border-e2e-hairline-strong bg-e2e-panel object-contain p-1"
      />
      <div className="min-w-0 pt-1">
        <p className="type-label-xs text-e2e-text-faint">Assistant</p>
        {text && <p className="mt-1.5 type-body whitespace-pre-wrap text-e2e-text-soft">{text}</p>}
      </div>
    </li>
  );
}

const subscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
