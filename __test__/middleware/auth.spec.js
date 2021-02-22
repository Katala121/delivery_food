import express        from 'express';
import request        from 'supertest';
import User           from '../../src/models/User.js';
import Admin           from '../../src/models/Admin.js';
import UserRouter     from '../../src/routers/UserRouter.js';
import AdminRouter     from '../../src/routers/AdminRouter.js';
import UserRepository from '../../src/repositories/UserRepository.js';
import AdminRepository from '../../src/repositories/AdminRepository.js';
import auth           from '../../src/middleware/Auth.js';
import jwt            from 'jsonwebtoken';

const app = express();

const client = {
    query: jest.fn(),
    release: jest.fn()
};
const pool = {
    connect: jest.fn(() => client),
    query: jest.fn()
};

jest.mock('../../src/repositories/UserRepository.js');
jest.mock('../../src/repositories/AdminRepository.js');
jest.mock('jsonwebtoken');

describe('test auth route', () => {
    test('test authUser method success answer', async () => {
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im15YWRyZXNzQGdtYWlsLmNvbSIsIm5hbWUiOiJBbGV4IiwiaWQiOiIxIiwiaWF0IjoxNjE0MDIyMjY0LCJleHAiOjE2MTQxMDg2NjR9.TgI7VmYpJh4KemhkaHcaxufpRlqFnxjRQ-7Jhxb3SWg';
        
        const user = new User({
            id: '1',
            name: 'Alex',
            email: 'myadress@gmail.com',
        });
        user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';
        
        UserRepository.mockImplementation(() => ({
                findByEmailAndId: () => user
        }));

        jwt.decode.mockImplementation(() => user);

        const userRouter = new UserRouter(pool);
        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/1')
            .set('Authorization', token);

        const response = res.body;

        expect(JSON.stringify(response))
            .toBe(JSON.stringify(user));
    });

    test('test authUser method ERROR answer', async () => {
                
        const userRouter = new UserRouter(pool);
        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/1');

        const response = res.text.indexOf('Invalid auth data');

        expect(response);
    });

    test('test authAdmin method success answer', async () => {
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50X2lkIjoxLCJuYW1lIjoic3VzaGkgbWFzdGVyIGFkbWluLXlvbGEiLCJpZCI6MSwiaWF0IjoxNjEzMzM0MzAyLCJleHAiOjE2MTM0MjA3MDJ9.UFq0yaqat_DftaZ8MOPaHR1U1TedaHwapJecnRB-lXc';
        
        const admin = new Admin({
            id: 1,
            name: 'Alex',
            restaurant: 1,
        });
        admin._password = '$2a$15$fLlELgwhSEpDrjd8FgH7Fu7t0YGbpJp6Az7.qs6uDUC0I94iwPXBq';
        
        AdminRepository.mockImplementation(() => ({
            findByNameAdminAndRestaurantId: () => admin,
            get: () => admin,
        }));
        const adminRouter = new AdminRouter(pool);
        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/1')
            .set('Authorization', token);

        const response = res.body;

        expect(JSON.stringify(response))
            .toBe(JSON.stringify(admin));
    });

    test('test authAdmin method ERROR answer', async () => {
                
        const adminRouter = new AdminRouter(pool);
        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/1');

        const response = res.text.indexOf('Invalid auth data');

        expect(response);
    });
});
