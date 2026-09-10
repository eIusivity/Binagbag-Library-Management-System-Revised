import { test, expect } from "@playwright/test";

test("Add Book interface opens", async ({ page }) => {
  await page.goto("http://localhost:5173/encodebook");

  await page.getByRole("button", { name: "Add Book" }).click();

  await expect(page.getByText("Book Information")).toBeVisible();
});
