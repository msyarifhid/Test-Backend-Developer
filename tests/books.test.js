const sequelize = require('../config/database');
const request = require('supertest');
const app = require('../app');

const User = require('../models/user');
const Author = require('../models/author');
const Book = require('../models/book');

let token;
let authorID;
let bookID;

beforeAll(async () => {
    await sequelize.sync({ force: true });
        // .then(() => console.log('Database synced'))
        // .catch(err => console.error('Unable to sync database:', err));
    const testUser = {
        name: 'Administrator',
        email: 'admin@admin.com',
        password: 'admin2341',
    };

    // Register admin
    await request(app).post('/api/auth/register').send({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
    });

    // Login admin
    const loginRes = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
    });

    token = loginRes.body.token;

    // Buat Author
    const author = await Author.create({
        name: 'Author 1',
        email: 'author1@example.com',
    });

    authorID = author.id;
});

describe('Book API', () => {

    test('Create a new book', async () => {
        const testBooks = {
            author_id: authorID,
            title: 'Book 1',
            description: 'Description 1',
        };
        
        const res = await request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send(testBooks);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');

        bookID = res.body.id;
    });

    test('Get all books with pagination', async () => {
        const res = await request(app)
            .get('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .query({ limit: 5, page: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('pages');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Array);
    });

    test('Get a book by ID', async () => {
        const res = await request(app)
            .get(`/api/books/${bookID}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', bookID);
    });

    test('Update a book by ID', async () => {
        const res = await request(app)
            .put(`/api/books/${bookID}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                author_id: authorID,
                title: 'Book 1 Updated',
                description: 'Updated Description',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Book 1 Updated');
    });

    test('Delete a book by ID', async () => {
        const res = await request(app)
            .delete(`/api/books/${bookID}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });
});

afterAll(async () => {
    await sequelize.close();
});