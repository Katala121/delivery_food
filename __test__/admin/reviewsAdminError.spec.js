import express from 'express';
import request  from 'supertest';
import AdminRouter from '../../src/routers/AdminRouter.js';
import ReviewRepository from '../../src/repositories/ReviewRepository.js';
import Admin from '../../src/models/Admin.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/ReviewRepository.js');
jest.mock('../../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkAdmin: (request, response, next) => {
            admin._password = '$2a$15$fLlELgwhSEpDrjd8FgH7Fu7t0YGbpJp6Az7.qs6uDUC0I94iwPXBq';
            request.admin = admin;
            next();
        }
    }
});

ReviewRepository.mockImplementation(() => {
    return {
        findByAdminId: () => {
            return review;
        },
    }
});

const review = {
    "id": "1",
    "restaurant_id": 1,
    "review": "normal",
    "rating": 3
};

const admin = new Admin({
    id: 1,
    name: 'name',
    restaurant: '1',
});

describe('test reviewsAdmin route', () => {
    test('test reviewsAdmin GET ALL method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/2/reviews');

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });
});