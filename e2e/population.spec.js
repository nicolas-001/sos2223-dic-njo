// @ts-check
import { test, expect } from '@playwright/test';


test('home has title correct', async ({ page }) => {
  await page.goto('localhost:12345');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("SOS2223-dic-njo");
});

test('navigate to frontend page', async ({ page }) => {
    await page.goto('localhost:12345');
    // Click the get started link.
    await page.getByRole('link', { name: 'Página principal del front end' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveTitle("Proyection-populations data");

    await page.waitForTimeout(1000);
    

   
});



test('navigate to integrations/uses  page', async ({ page }) => {
    await page.goto('localhost:12345');
        
    // Click the get started link.
    await page.getByRole('link', { name: 'Gráficas de usos y integraciones' }).click();
        
    // Expects the URL to contain intro.
    await expect(page).toHaveTitle("Integraciones y usos");
});