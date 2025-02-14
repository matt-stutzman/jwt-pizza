import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});
//needs a mock
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

//doesn't need a mock
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

test('register', async ({page}) =>{
    await page.route('*/**/api/auth', async (route) => {
        const registerRequest = {
            name: "Jared",
            email: "Jared@jwt.com",
            password: "Jared'spassword"
        }
        const registerResult = {
            user: {
                name: "Jared",
                email: "Jared@jwt.com",
                roles: [
                {
                    role: "diner"
                }
                ],
                id: 213
                },
            token: "token"
        }
        expect(route.request().method()).toBe("POST");
        expect(route.request().postDataJSON()).toMatchObject(registerRequest);
        await route.fulfill({json: registerResult});
    });
    
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

//doesn't need a mock
test("history", async({page}) =>{
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('History');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
})

//needs a mock
test("logout", async({page}) =>{

    await page.route("*/**/api/auth", async (route) => {
        if(route.request().method() == "DELETE"){
            const deleteResponse = {
                message: "logout successful"
            }
            await route.fulfill({json: deleteResponse});
        }
        else if(route.request().method() == "PUT"){
            const loginResponse = {
                user: {
                    id: 1,
                    name: "常用名字",
                    email: "a@jwt.com",
                    roles: [
                    {
                        role: "admin"
                    }
                    ]
                },
                token: "token"
            }
            await route.fulfill({json: loginResponse});
        }
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    // await page.waitForResponse("*/api/auth")
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
})

//needs a mock
test("create and close franchise / admin dashboard", async({page}) =>{
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

//needs a mock
test("create and close store", async ({page}) => {
    /*
    put: http://localhost:3000/api/auth 
    {
    "email": "f@jwt.com",
    "password": "franchisee"
    }
    get: http://localhost:3000/api/franchise/3
    post: {
    "id": "",
    "name": "fake store"
    }

    */
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

//does need a mock
test("docs", async({page}) => {
    await page.route('*/**/api/docs', async (route) => {
        const docsResponse = {
            "version": "20240518.154317",
            "endpoints": [
              {
                "method": "POST",
                "path": "/api/auth",
                "description": "Register a new user",
                "example": "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
                "response": {
                  "user": {
                    "id": 2,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                      {
                        "role": "diner"
                      }
                    ]
                  },
                  "token": "tttttt"
                }
              },
              {
                "method": "PUT",
                "path": "/api/auth",
                "description": "Login existing user",
                "example": "curl -X PUT localhost:3000/api/auth -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json'",
                "response": {
                  "user": {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                      {
                        "role": "admin"
                      }
                    ]
                  },
                  "token": "tttttt"
                }
              },
              {
                "method": "PUT",
                "path": "/api/auth/:userId",
                "requiresAuth": true,
                "description": "Update user",
                "example": "curl -X PUT localhost:3000/api/auth/1 -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'",
                "response": {
                  "id": 1,
                  "name": "常用名字",
                  "email": "a@jwt.com",
                  "roles": [
                    {
                      "role": "admin"
                    }
                  ]
                }
              },
              {
                "method": "DELETE",
                "path": "/api/auth",
                "requiresAuth": true,
                "description": "Logout a user",
                "example": "curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'",
                "response": {
                  "message": "logout successful"
                }
              },
              {
                "method": "GET",
                "path": "/api/order/menu",
                "description": "Get the pizza menu",
                "example": "curl localhost:3000/api/order/menu",
                "response": [
                  {
                    "id": 1,
                    "title": "Veggie",
                    "image": "pizza1.png",
                    "price": 0.0038,
                    "description": "A garden of delight"
                  }
                ]
              },
              {
                "method": "PUT",
                "path": "/api/order/menu",
                "requiresAuth": true,
                "description": "Add an item to the menu",
                "example": "curl -X PUT localhost:3000/api/order/menu -H 'Content-Type: application/json' -d '{ \"title\":\"Student\", \"description\": \"No topping, no sauce, just carbs\", \"image\":\"pizza9.png\", \"price\": 0.0001 }'  -H 'Authorization: Bearer tttttt'",
                "response": [
                  {
                    "id": 1,
                    "title": "Student",
                    "description": "No topping, no sauce, just carbs",
                    "image": "pizza9.png",
                    "price": 0.0001
                  }
                ]
              },
              {
                "method": "GET",
                "path": "/api/order",
                "requiresAuth": true,
                "description": "Get the orders for the authenticated user",
                "example": "curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'",
                "response": {
                  "dinerId": 4,
                  "orders": [
                    {
                      "id": 1,
                      "franchiseId": 1,
                      "storeId": 1,
                      "date": "2024-06-05T05:14:40.000Z",
                      "items": [
                        {
                          "id": 1,
                          "menuId": 1,
                          "description": "Veggie",
                          "price": 0.05
                        }
                      ]
                    }
                  ],
                  "page": 1
                }
              },
              {
                "method": "POST",
                "path": "/api/order",
                "requiresAuth": true,
                "description": "Create a order for the authenticated user",
                "example": "curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"storeId\":1, \"items\":[{ \"menuId\": 1, \"description\": \"Veggie\", \"price\": 0.05 }]}'  -H 'Authorization: Bearer tttttt'",
                "response": {
                  "order": {
                    "franchiseId": 1,
                    "storeId": 1,
                    "items": [
                      {
                        "menuId": 1,
                        "description": "Veggie",
                        "price": 0.05
                      }
                    ],
                    "id": 1
                  },
                  "jwt": "1111111111"
                }
              },
              {
                "method": "GET",
                "path": "/api/franchise",
                "description": "List all the franchises",
                "example": "curl localhost:3000/api/franchise",
                "response": [
                  {
                    "id": 1,
                    "name": "pizzaPocket",
                    "admins": [
                      {
                        "id": 4,
                        "name": "pizza franchisee",
                        "email": "f@jwt.com"
                      }
                    ],
                    "stores": [
                      {
                        "id": 1,
                        "name": "SLC",
                        "totalRevenue": 0
                      }
                    ]
                  }
                ]
              },
              {
                "method": "GET",
                "path": "/api/franchise/:userId",
                "requiresAuth": true,
                "description": "List a user's franchises",
                "example": "curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'",
                "response": [
                  {
                    "id": 2,
                    "name": "pizzaPocket",
                    "admins": [
                      {
                        "id": 4,
                        "name": "pizza franchisee",
                        "email": "f@jwt.com"
                      }
                    ],
                    "stores": [
                      {
                        "id": 4,
                        "name": "SLC",
                        "totalRevenue": 0
                      }
                    ]
                  }
                ]
              },
              {
                "method": "POST",
                "path": "/api/franchise",
                "requiresAuth": true,
                "description": "Create a new franchise",
                "example": "curl -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt' -d '{\"name\": \"pizzaPocket\", \"admins\": [{\"email\": \"f@jwt.com\"}]}'",
                "response": {
                  "name": "pizzaPocket",
                  "admins": [
                    {
                      "email": "f@jwt.com",
                      "id": 4,
                      "name": "pizza franchisee"
                    }
                  ],
                  "id": 1
                }
              },
              {
                "method": "DELETE",
                "path": "/api/franchise/:franchiseId",
                "requiresAuth": true,
                "description": "Delete a franchises",
                "example": "curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'",
                "response": {
                  "message": "franchise deleted"
                }
              },
              {
                "method": "POST",
                "path": "/api/franchise/:franchiseId/store",
                "requiresAuth": true,
                "description": "Create a new franchise store",
                "example": "curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}' -H 'Authorization: Bearer tttttt'",
                "response": {
                  "id": 1,
                  "name": "SLC",
                  "totalRevenue": 0
                }
              },
              {
                "method": "DELETE",
                "path": "/api/franchise/:franchiseId/store/:storeId",
                "requiresAuth": true,
                "description": "Delete a store",
                "example": "curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'",
                "response": {
                  "message": "store deleted"
                }
              }
            ],
            "config": {
              "factory": "https://pizza-factory.cs329.click",
              "db": "127.0.0.1"
            }
          }
        await route.fulfill({json: docsResponse});
    });
    await page.goto('http://localhost:5173/docs');
    await expect(page.getByRole('main')).toContainText('JWT Pizza API');
    await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '[PUT] /api/auth', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' })).toBeVisible();
})