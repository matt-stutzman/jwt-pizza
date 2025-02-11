import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login', async ({ page }) => {
   await page.goto('http://localhost:5173/');
   await page.getByRole('button', { name: 'Order now' }).click();
   await expect(page.locator('h2')).toContainText('Awesome is a click away');
   await page.getByRole('combobox').selectOption('1');
   await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
   await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
   await page.getByRole('button', { name: 'Checkout' }).click();
   await page.getByRole('textbox', { name: 'Email address' }).click();
   await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
   await page.getByRole('button', { name: 'Login' }).click();
   await page.getByRole('textbox', { name: 'Password' }).click();
   await page.getByRole('textbox', { name: 'Password' }).fill('admin');
   await page.getByRole('button', { name: 'Login' }).click();
   await page.getByRole('button', { name: 'Pay now' }).click();
   await expect(page.getByRole('main')).toContainText('0.008 ₿');
   await expect(page.getByRole('main')).toContainText('0.008 ₿');
});

test('about', async({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('main')).toContainText('The secret sauce');
    await expect(page.locator('div').filter({ hasText: /^James$/ }).getByRole('img')).toBeVisible();
    await page.locator('div').filter({ hasText: /^Maria$/ }).getByRole('img').click();
    await page.locator('div').filter({ hasText: /^Anna$/ }).getByRole('img').click();
    await page.locator('div').filter({ hasText: /^Brian$/ }).getByRole('img').click();
    await expect(page.getByRole('main')).toContainText('Our employees');
    await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
})