import express from 'express';
import request  from 'supertest';
import UserRouter from '../../src/routers/UserRouter.js';
import BasketRepository from '../../src/repositories/BasketRepository.js';
import User from '../../src/models/User.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/BasketRepository.js');
jest.mock('../../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

BasketRepository.mockImplementation(() => {
    return {
        get: (id) => {
            return basket;
        },
        addDishInBasket: (email) => {
            return basket;
        },
        deleteDishFromBasket: () => {
            return basket;
        },
    }
});

const basket = [
    {
        "dish_id": "1",
        "description": "roll tempura is a hot rolls",
        "photo_link": "link",
        "price": "250,00 ₽",
        "category_id": 1,
        "restaurant_id": 1
    }
];

const user = new User({
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'email',
    photo:  'link'
});
user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';

describe('test basket route', () => {
    test('test basket GET method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/basket');

        const response = res.text.indexOf('Invalid user information');
    
        expect(response);
    });

    test('test basket POST method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/2/basket/1');

        const response = res.text.indexOf('Invalid user information');
    
        expect(response);
    });

    test('test basket DELETE method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .delete('/api/users/2/basket/1');

        const response = res.text.indexOf('Invalid user information');
    
        expect(response);
    });
});