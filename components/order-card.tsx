import clsx from "clsx";

import type { ChatMessage } from "@/lib/assistant";

type LookUpOrderPart = Extract<ChatMessage["parts"][number], { type: "tool-lookUpOrder" }>;

export function OrderCard({ part }: { part: LookUpOrderPart }) {
  if (part.state === "output-error") {
    return <p className="type-code-s text-e2e-accent">Couldn&apos;t look up the order.</p>;
  }
  if (part.state !== "output-available") {
    return <p className="type-code-s text-e2e-text-faint">Looking up the order…</p>;
  }

  const order = part.output;
  return (
    <section
      aria-label={`Order ${order.number}`}
      className="max-w-96 border border-e2e-hairline-strong bg-e2e-panel p-4"
    >
      <p className="type-label-xs text-e2e-text-faint">Order {order.number}</p>
      <p data-testid="order-status" className="mt-1 type-h3-display text-e2e-text-bright">
        {order.found ? order.status : "Not found"}
      </p>
      {order.found ? (
        <dl className="mt-3 flex flex-col gap-2 border-t border-e2e-hairline-strong pt-3 type-body-s">
          <Row label="Item" value={order.item} />
          {order.deliveredOn && <Row label="Delivered" value={order.deliveredOn} />}
          {order.carrier && <Row label="Carrier" value={order.carrier} />}
          {order.tracking && <Row label="Tracking" value={order.tracking} testId="order-tracking" mono />}
          {order.shipsWithin && <Row label="Ships within" value={order.shipsWithin} />}
        </dl>
      ) : (
        <p className="mt-1 type-body-s text-e2e-text-soft">No order has this number.</p>
      )}
    </section>
  );
}

function Row({ label, value, testId, mono }: { label: string; value: string; testId?: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-e2e-text-faint">{label}</dt>
      <dd data-testid={testId} className={clsx("text-right text-e2e-text-soft", mono && "type-code-s")}>
        {value}
      </dd>
    </div>
  );
}
