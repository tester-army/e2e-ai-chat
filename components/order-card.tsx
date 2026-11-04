import clsx from "clsx";

import type { ChatMessage } from "@/lib/assistant";

type LookUpOrderPart = Extract<ChatMessage["parts"][number], { type: "tool-lookUpOrder" }>;

export function OrderCard({ part }: { part: LookUpOrderPart }) {
  if (part.state === "output-error") {
    return <p className="type-body-s text-e2e-mint">couldn&apos;t look up the order.</p>;
  }
  if (part.state !== "output-available") {
    return <p className="type-caption text-e2e-neutral-500">looking up the order…</p>;
  }

  const order = part.output;
  return (
    <section
      aria-label={`order ${order.number}`}
      className="max-w-96 border border-e2e-neutral-800 bg-e2e-neutral-800/40 p-e2e-3"
    >
      {/* The number is data, so it keeps its case outside the lowercase caption. */}
      <p className="flex items-baseline gap-e2e-1">
        <span className="type-caption text-e2e-neutral-500">order</span>
        <span className="type-code-s text-e2e-neutral-400">{order.number}</span>
      </p>
      <p data-testid="order-status" className="mt-e2e-1 type-h4 text-e2e-off-white">
        {order.found ? order.status : "not found"}
      </p>
      {order.found ? (
        <dl className="mt-e2e-2 flex flex-col gap-e2e-1 border-t border-e2e-neutral-800 pt-e2e-2 type-body-s">
          <Row label="item" value={order.item} />
          {order.deliveredOn && <Row label="delivered" value={order.deliveredOn} />}
          {order.carrier && <Row label="carrier" value={order.carrier} />}
          {order.tracking && <Row label="tracking" value={order.tracking} testId="order-tracking" mono />}
          {order.shipsWithin && <Row label="ships within" value={order.shipsWithin} />}
        </dl>
      ) : (
        <p className="mt-e2e-1 type-body-s text-e2e-neutral-300">no order has this number.</p>
      )}
    </section>
  );
}

function Row({ label, value, testId, mono }: { label: string; value: string; testId?: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-e2e-2">
      <dt className="text-e2e-neutral-500">{label}</dt>
      <dd data-testid={testId} className={clsx("text-right text-e2e-neutral-300", mono && "type-code-s")}>
        {value}
      </dd>
    </div>
  );
}
