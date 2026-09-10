import { expect, test } from "@playwright/test";

test("member can open a workspace and send a message", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Maya Chen/i }).click();
  await expect(page.getByRole("heading", { name: "#general" })).toBeVisible();
  await page.getByLabel("Message").fill("Shipping the messenger shell");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Shipping the messenger shell")).toBeVisible();
});
