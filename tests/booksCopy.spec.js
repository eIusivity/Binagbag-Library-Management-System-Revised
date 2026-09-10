import { test, expect } from "@playwright/test";

test("user can add physical copies to a book product", async ({ page }) => {
  await page.goto("/");

  const bookCard = page
    .locator(
      "a, button, [data-testid='book-card'], [data-testid='product-card']",
    )
    .filter({ hasText: /book|title|author/i })
    .first();

  await expect(bookCard).toBeVisible();
  await bookCard.click();

  const physicalCopiesButton = page
    .locator("button, a, [role='button']")
    .filter({ hasText: /physical copies/i })
    .first();

  await expect(physicalCopiesButton).toBeVisible();
  await physicalCopiesButton.click();

  const addCopyButton = page
    .locator("button, a, [role='button']")
    .filter({ hasText: /add copy/i })
    .first();

  await expect(addCopyButton).toBeVisible();
  await addCopyButton.click();

  const quantityInput = page
    .locator(
      'input[type="number"], input[name*="copy"], input[name*="quantity"], input[id*="copy"], input[id*="quantity"]',
    )
    .first();

  await expect(quantityInput).toBeVisible();
  await quantityInput.fill("2");

  const submitButton = page
    .locator("button, input[type='submit']")
    .filter({ hasText: /submit physical copies|submit/i })
    .first();

  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(
    page.locator("text=/success|added|updated|saved/i").first(),
  ).toBeVisible({ timeout: 15000 });

  await page.reload();

  await expect(
    page.locator("text=/2 physical copies|2 copies|Total Copies: 2/i").first(),
  ).toBeVisible({ timeout: 15000 });
});
