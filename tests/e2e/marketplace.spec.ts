import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

test.describe('Marketplace E2E Flows', () => {
    let token: string;
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User'
    };

    test('User Signup and Authentication', async ({ request }) => {
        const signup = await request.post(`${API_URL}/auth/register`, {
            data: testUser
        });
        expect(signup.ok()).toBeTruthy();
        const body = await signup.json();
        expect(body.user.email).toBe(testUser.email);
        token = body.tokens.access.token;
    });

    test('Product Creation and Retrieval', async ({ request }) => {
        const productData = {
            title: 'E2E Test Product',
            description: 'This is a product created by Playwright',
            price: 99.99,
            stock: 10,
            categoryId: '00000000-0000-0000-0000-000000000000' // Use a real ID if available or mock
        };

        const create = await request.post(`${API_URL}/products`, {
            data: productData,
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(create.ok()).toBeTruthy();
        const product = await create.json();
        expect(product.title).toBe(productData.title);

        const get = await request.get(`${API_URL}/products/${product.id}`);
        expect(get.ok()).toBeTruthy();
        expect((await get.json()).id).toBe(product.id);
    });
});
