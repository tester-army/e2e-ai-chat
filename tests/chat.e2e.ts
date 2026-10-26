import { describe, test } from "@e2e-dev/web";
import { gateway } from "ai";
import { expect } from "e2e";

import { generationIds, skip } from "./fixtures";

const REPLY_FINISHED = "the assistant has finished its reply";
// The Gateway takes a few seconds to record a generation.
const GATEWAY_POLL = { timeout: 30_000, interval: 1_000 };

describe("support chat", { tags: ["chat"], skip }, () => {
  test("answers a shipping question from the store's policy", async ({ app, screen, agent, browser }) => {
    await app.open("/");
    const response = browser.waitForResponse("**/api/chat");
    await screen.getByLabel("Message").fill("Do I get free shipping on two T-shirts?");
    await screen.getByRole("button", "Send").click();

    await agent.waitFor(REPLY_FINISHED, { timeout: 60_000 });
    await agent.assert("the assistant's reply says an order of two T-shirts does not get free shipping");

    const [id] = generationIds(await (await response).text());
    await expect
      .poll(() => gateway.getGenerationInfo({ id }), GATEWAY_POLL)
      .toMatchObject({ model: expect.stringMatching(/^reflection\/beam/), streamed: true, finishReason: "stop" });
  });

  test("looks up an order with the tool and shows it in a card", async ({ app, screen, agent, browser }) => {
    await app.open("/");
    const response = browser.waitForResponse("**/api/chat");
    await screen.getByRole("button", "Where is order E2E-1002?").click();

    // The card shows the tool's result, which comes from a fixed list, so its text is exact.
    const order = screen.getByRole("region", "Order E2E-1002");
    await expect(order.getByTestId("order-status")).toHaveText("Shipped", { timeout: 30_000 });
    await expect(order.getByTestId("order-tracking")).toHaveText("1Z999AA10123456784");

    await agent.waitFor(REPLY_FINISHED, { timeout: 60_000 });
    await agent.assert("the assistant's reply says order E2E-1002 has shipped");

    // The first step ended in a tool call: the model chose the tool.
    const [toolStep] = generationIds(await (await response).text());
    await expect
      .poll(() => gateway.getGenerationInfo({ id: toolStep }), GATEWAY_POLL)
      .toMatchObject({ finishReason: "tool-calls" });
  });

  test("declines a request that isn't about the store", async ({ app, screen, agent }) => {
    await app.open("/");
    await screen.getByLabel("Message").fill("Write a short poem about the sea.");
    await screen.getByRole("button", "Send").click();

    await agent.waitFor(REPLY_FINISHED, { timeout: 60_000 });
    await agent.assert("the assistant politely declines to write the poem and says what it can help with");
  });

  test("recovers from a failed chat request with Retry", async ({ app, screen, agent, browser }) => {
    let calls = 0;
    await browser.route("**/api/chat", (route) => {
      calls++;
      return route.fulfill({ status: 500, json: { error: "Model unavailable" } });
    });
    await app.open("/");
    await screen.getByLabel("Message").fill("How long do I have to return a T-shirt?");
    await screen.getByRole("button", "Send").click();

    // Next.js's route announcer is an alert too, so look inside the page's main.
    const chat = screen.getByRole("main");
    await expect(chat.getByRole("alert")).toHaveText("Something went wrong. The assistant didn't answer.");
    await expect(screen.getByLabel("Message")).toBeDisabled();

    await browser.unroute("**/api/chat");
    await chat.getByRole("button", "Retry").click();

    await agent.waitFor(REPLY_FINISHED, { timeout: 60_000 });
    await agent.assert("the assistant's reply says a T-shirt can be returned within 45 days");
    await expect(chat.getByRole("alert")).toBeHidden();
    await expect(screen.getByText("How long do I have to return a T-shirt?")).toHaveCount(1);
    expect(calls).toBe(1);
  });
});
