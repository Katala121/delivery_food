import express from 'express';
import request  from 'supertest';
import UserRouter from '../../src/routers/UserRouter.js';
import ReviewRepository from '../../src/repositories/ReviewRepository.js';
import User from '../../src/models/User.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/ReviewRepository.js');
jest.mock('../../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

ReviewRepository.mockImplementation(() => {
    return {
        create: () => {
            return review;
        },
        findByRestaurantId: () => {
            return review;
        },
        get: () => {
            return review;
        },
        update: () => {
            return review;
        },
        delete: () => {
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

const user = new User({
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'email',
    photo:  'link'
});
user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';

describe('test reviews route', () => {
    test('test reviews POST method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/2/reviews/1')
            .send({
                review: "normal",
	            rating: 3
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test reviews GET ALL method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/reviews/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test reviews GET method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/reviews/1/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test reviews PUT method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .put('/api/users/2/reviews/1/1')
            .send({
                review: "normal",
	            rating: 3
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test reviews DELETE method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .delete('/api/users/2/reviews/1/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });
});