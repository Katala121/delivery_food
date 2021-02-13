import express from 'express';
import request  from 'supertest';
import UserRouter from '../src/routers/UserRouter.js';
import OrderRepository from '../src/repositories/OrderRepository.js';
import User from '../src/models/User.js';
import auth from '../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../src/repositories/OrderRepository.js');
jest.mock('../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

OrderRepository.mockImplementation(() => {
    return {
        create: () => {
            return order;
        },
        findByUserId: () => {
            return order;
        },
        getOrder: () => {
            return order;
        },
        update: () => {
            return order;
        },
    }
});

const order = {
    "id": "1",
    "user_id": "1",
    "delivery_address_id": "1",
    "order_cost": "300,00 ₽",
    "restaurant_id": 1,
    "order_time": "2021-02-11T21:13:28.103Z",
    "status": "new"
};

const user = new User({
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'email',
    photo:  'link'
});
user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';

describe('test order route', () => {
    test('test order POST method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/2/orders')
            .send({
                delivery_address_id: "1",
                order_cost: "300,00 ₽",
                restaurant_id: 1,
                dishes_list: [
                    {
                        "id": 1,
                        "quantity": 2
                    }
                ]
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test order GET ALL method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/orders');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test order GET method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/orders/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test order PUT method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .put('/api/users/2/orders/1')
            .send({
                delivery_address_id: "1",
                order_cost: "300,00 ₽",
                restaurant_id: 1,
                dishes_list: [
                    {
                        "id": 1,
                        "quantity": 2
                    }
                ]
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });
});