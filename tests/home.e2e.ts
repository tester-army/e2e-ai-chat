import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("the chat opens empty, with suggestions, a message box, and a send button", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "how can we help?")).toBeVisible();
  await expect(screen.getByRole("list", "suggestions").getByRole("button")).toHaveCount(3);
  await expect(screen.getByLabel("message")).toHaveValue("");
  await expect(screen.getByRole("button", "send")).toBeDisabled();
});

test("send turns on once there is a message", async ({ app, screen }) => {
  await app.open("/");

  await screen.getByLabel("message").fill("Do I get free shipping on two T-shirts?");
  await expect(screen.getByRole("button", "send")).toBeEnabled();
});
