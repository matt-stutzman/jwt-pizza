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
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
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

test('admin dashboard', async ({page}) =>{
    // await page.goto('http://localhost:5173/');
    // await page.getByRole('link', { name: 'Login' }).click();
    // await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    // await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    // await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    // await page.getByRole('button', { name: 'Login' }).click();
    // await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    // await page.getByRole('link', { name: 'Admin' }).click();
    // await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
    // await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
    // await expect(page.getByRole('main')).toContainText('Add Franchise');
    // await expect(page.getByRole('main')).toBeEnabled();
})

test('register', async ({page}) =>{
    await page.goto('http://localhost:5173/');
    await expect(page.locator('#navbar-dark')).toContainText('Register');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page.getByRole('heading')).toContainText('Welcome to the party');
    await expect(page.locator('form')).toContainText('Register');
    await expect(page.locator('form')).toContainText('Already have an account? Login instead.');
    await expect(page.getByRole('main').getByText('Login')).toBeVisible();
    await page.getByRole('textbox', { name: 'Full name' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('Jared');
    await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Email address' }).fill('Jared@');
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('Jared@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('Jared\'spassword');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: 'J' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
})

test("history", async({page}) =>{
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('History');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
})

test("logout", async({page}) =>{
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
})

test("create and close franchise", async({page}) =>{
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
    await expect(page.getByRole('main')).toContainText('Add Franchise');
    await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await expect(page.getByRole('heading')).toContainText('Create franchise');
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('fake franchise');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('table')).toContainText('fake franchise');
    await expect(page.getByRole('table')).toContainText('Close');
    await page.getByRole('row', { name: 'fake franchise 常用名字 Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('row', { name: 'fake franchise 常用名字 Close' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Close' }).click();
})

test("create and close store", async ({page}) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
    await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('fake store');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'fake store' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'fake store 0 ₿ Close' }).getByRole('button')).toBeVisible();
    await page.getByRole('row', { name: 'fake store 0 ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
})

test("docs", async({page}) => {
    await page.goto('http://localhost:5173/docs');
    await expect(page.getByRole('main')).toContainText('JWT Pizza API');
    await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '[PUT] /api/auth', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' })).toBeVisible();
})