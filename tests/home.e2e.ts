import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("the chat opens empty, with suggestions, a message box, and a Send button", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "How can we help?")).toBeVisible();
  await expect(screen.getByRole("list", "Suggestions").getByRole("button")).toHaveCount(3);
  await expect(screen.getByLabel("Message")).toHaveValue("");
  await expect(screen.getByRole("button", "Send")).toBeDisabled();
});

test("Send turns on once there is a message", async ({ app, screen }) => {
  await app.open("/");

  await screen.getByLabel("Message").fill("Do I get free shipping on two T-shirts?");
  await expect(screen.getByRole("button", "Send")).toBeEnabled();
});
