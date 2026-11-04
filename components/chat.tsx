"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useSyncExternalStore, type SubmitEvent } from "react";

import { OrderCard } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import type { ChatMessage } from "@/lib/assistant";

const SUGGESTIONS = ["do i get free shipping on two t-shirts?", "where is order E2E-1002?", "how do returns work?"];

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
        <div className="mx-auto mt-auto w-full max-w-180 px-e2e-3 pb-e2e-5 text-center">
          <p className="type-caption text-e2e-mint">e2e store support</p>
          <h1 className="mt-e2e-2 type-h2 text-e2e-off-white">how can we help?</h1>
          <p className="mx-auto mt-e2e-3 max-w-120 type-body-l text-e2e-neutral-400">
            a support chat on a real model, tested end to end with e2e: each reply is judged for what it means, not its
            exact words.
          </p>
        </div>
      ) : (
        // column-reverse keeps the view at the newest message while a reply streams in.
        <div className="flex flex-1 [scrollbar-gutter:stable_both-edges] flex-col-reverse overflow-y-auto">
          <div className="mx-auto flex w-full max-w-180 flex-col gap-e2e-4 px-e2e-3 py-e2e-5">
            <ol aria-label="conversation" className="flex flex-col gap-e2e-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </ol>
            {answering && (
              <p role="status" className="flex items-center gap-e2e-1 pl-e2e-6 type-caption text-e2e-neutral-500">
                <span aria-hidden="true" className="size-1.5 bg-e2e-green motion-safe:animate-pulse" />
                answering…
              </p>
            )}
            {error && (
              <div className="flex items-center justify-between gap-e2e-2 border border-e2e-mint py-e2e-1 pr-e2e-1 pl-e2e-2 sm:ml-e2e-6">
                <p role="alert" className="type-body-s text-e2e-mint">
                  something went wrong. the assistant didn&apos;t answer.
                </p>
                <Button variant="outline" className="shrink-0" onClick={() => regenerate()}>
                  retry
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The same gutters as the conversation, so both center on one line whether or not a scrollbar shows. */}
      <div className="shrink-0 [scrollbar-gutter:stable_both-edges] overflow-hidden">
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-180 px-e2e-3">
          <div className="flex items-center gap-e2e-1 bg-e2e-neutral-800 p-e2e-1 pl-e2e-2 focus-within:outline-2 focus-within:outline-e2e-green">
            <input
              ref={inputRef}
              aria-label="message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              // A message typed before React hydrates would be lost.
              readOnly={!hydrated}
              // After an error, retry sends the question again.
              disabled={error != null}
              placeholder="ask the store a question"
              autoComplete="off"
              className="h-e2e-6 min-w-0 flex-1 bg-transparent type-body-m text-e2e-off-white caret-e2e-green outline-none placeholder:text-e2e-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" disabled={!input.trim() || answering || error != null} className="shrink-0">
              send
            </Button>
          </div>
        </form>
      </div>

      {empty ? (
        <ul
          aria-label="suggestions"
          className="mx-auto mb-auto flex w-full max-w-180 flex-wrap justify-center gap-e2e-1 px-e2e-3 pt-e2e-2"
        >
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => ask(suggestion)}
                // A tap before React hydrates would do nothing.
                disabled={!hydrated}
                className="flex min-h-e2e-5 cursor-pointer items-center border border-e2e-neutral-700 px-e2e-2 py-e2e-1 type-body-s text-e2e-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-e2e-green disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="px-e2e-3 pt-e2e-2 pb-e2e-3 text-center type-code-s text-e2e-neutral-500">
        {model} · Vercel AI Gateway
      </p>
    </main>
  );
}

function Message({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    const text = message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
    return (
      <li className="flex justify-end">
        <span className="sr-only">you: </span>
        <p className="max-w-[85%] bg-e2e-neutral-800 px-e2e-2 py-e2e-1 type-body-m whitespace-pre-wrap text-e2e-off-white">
          {text}
        </p>
      </li>
    );
  }

  return (
    <li className="flex gap-e2e-2">
      <span className="grid size-e2e-4 shrink-0 place-items-center border border-e2e-neutral-800 bg-e2e-neutral-800/40 text-e2e-off-white">
        <Logo variant="sign" label="" className="h-e2e-2 w-auto" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-e2e-1 pt-e2e-half">
        <p className="type-caption text-e2e-neutral-500">assistant</p>
        {message.parts.map((part, index) => {
          if (part.type === "text" && part.text) {
            return (
              <p key={index} className="type-body-m whitespace-pre-wrap text-e2e-off-white">
                {part.text}
              </p>
            );
          }
          if (part.type === "tool-lookUpOrder") return <OrderCard key={part.toolCallId} part={part} />;
          return null;
        })}
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
