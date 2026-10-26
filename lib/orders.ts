// A fixed list instead of a database: the card shows these values exactly, so a test can check them.
export type Order = {
  status: "Delivered" | "Shipped" | "Processing";
  item: string;
  deliveredOn?: string;
  carrier?: string;
  tracking?: string;
  shipsWithin?: string;
};

const ORDERS: Record<string, Order> = {
  "E2E-1001": { status: "Delivered", item: "e2e T-shirt, size M", deliveredOn: "October 20, 2026" },
  "E2E-1002": { status: "Shipped", item: "2 × e2e T-shirt, size L", carrier: "UPS", tracking: "1Z999AA10123456784" },
  "E2E-1003": { status: "Processing", item: "e2e T-shirt, size S", shipsWithin: "2 business days" },
};

export function findOrder(orderNumber: string) {
  const number = orderNumber.trim().toUpperCase();
  const order = ORDERS[number];
  return order ? { found: true as const, number, ...order } : { found: false as const, number };
}
