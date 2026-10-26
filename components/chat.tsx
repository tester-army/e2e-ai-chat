"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";

import { LightButton } from "@/components/ui/light-button";

export function Chat() {
  const [input, setInput] = useState("");
  const hydrated = useHydrated();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Nothing is sent yet: the chat route comes next.
  }

  return (
    <section
      aria-labelledby="chat-heading"
      className="flex h-140 flex-col border border-e2e-hairline-strong bg-e2e-panel"
    >
      <div className="border-b border-e2e-hairline-strong px-5 py-4">
        <h2 id="chat-heading" className="type-label-xs text-e2e-text-faint">
          e2e Store support
        </h2>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
        <p className="m-auto max-w-64 text-center type-body-s text-e2e-text-muted">
          Ask about shipping, returns, sizes, or an order.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-[minmax(0,1fr)_96px] gap-2 border-t border-e2e-hairline-strong p-3"
      >
        <input
          aria-label="Message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          // A message typed before React hydrates would be lost.
          readOnly={!hydrated}
          placeholder="Type a message"
          autoComplete="off"
          className="block h-10 w-full border border-e2e-field-stroke bg-e2e-field-fill px-4 type-field text-e2e-text-bright caret-e2e-caret transition-[border-color,background-color] duration-200 placeholder:text-e2e-text-faint hover:border-e2e-white-50 focus:border-e2e-button-stroke focus:bg-e2e-panel-raised focus:outline-none motion-reduce:transition-none"
        />
        <LightButton type="submit" disabled={!input.trim()}>
          Send
        </LightButton>
      </form>
    </section>
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
