import express from 'express';
import request  from 'supertest';
import UserRouter from '../../src/routers/UserRouter.js';
import AddressRepository from '../../src/repositories/AddressRepository.js';
import User from '../../src/models/User.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/AddressRepository.js');
jest.mock('../../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

AddressRepository.mockImplementation(() => {
    return {
        create: () => {
            return address;
        },
        getAll: () => {
            return address;
        },
        get: () => {
            return address;
        },
        update: () => {
            return address;
        },
        delete: () => {
            return address;
        },
    }
});

const address = {
    "id": "1",
    "user_id": "1",
    "address_name": "work",
    "address": "3425 Stone Street, Apt. 2A, Jacksonville, FL 39404"
};

const user = new User({
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'email',
    photo:  'link'
});
user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';

describe('test address route', () => {
    test('test address POST method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/2/address')
            .send({
                address_name: "work",
                address: "3425 Stone Street, Apt. 2A, Jacksonville, FL 39404"
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test address GET ALL method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/address');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test address GET method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2/address/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test address PUT method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .put('/api/users/2/address/1')
            .send({
                address_name: "work",
                address: "3425 Stone Street, Apt. 2A, Jacksonville, FL 39404"
            });

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });

    test('test address DELETE method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .delete('/api/users/2/address/1');

        const response = res.text.indexOf('Invalid user information');

        expect(response);
    });
});