const request = require('supertest');
const app = require('../app');

const User = require('../models/user');

describe('Auth API', () => {
    const testUser = {
        name: 'Administrator',
        email: 'admin@admin.com',
        password: 'admin2341',
    };

    test('Register new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', testUser.name);
        expect(res.body).toHaveProperty('email', testUser.email);
    });

    test('Login existing user and get token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
