import express from 'express';
import request  from 'supertest';
import AdminRouter from '../../src/routers/AdminRouter.js';
import OrderRepository from '../../src/repositories/OrderRepository.js';
import Admin from '../../src/models/Admin.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/OrderRepository.js');
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

OrderRepository.mockImplementation(() => {
    return {
        findByAdminId: () => {
            return order;
        },
        getOrderForAdmin: () => {
            return order;
        },
        updateByAdmin: () => {
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

const admin = new Admin({
    id: 1,
    name: 'name',
    restaurant: '1',
});

describe('test orderAdmin route', () => {
    test('test orderAdmin GET ALL method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/1/orders');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(order));
    });

    test('test order GET method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/1/orders/1');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(order));
    });

    test('test orderAdmin PUT method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .put('/api/admins/1/orders/1')
            .send({
                status: 'cenceled'
            });

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(order));
    });
});