import express from 'express';
import request  from 'supertest';
import AdminRouter from '../src/routers/AdminRouter.js';
import AdminRepository from '../src/repositories/AdminRepository.js';
import Admin from '../src/models/Admin.js';
import auth from '../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../src/repositories/AdminRepository.js');
jest.mock('../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkAdmin: (request, response, next) => {
            admin._password = '$2a$15$fLlELgwhSEpDrjd8FgH7Fu7t0YGbpJp6Az7.qs6uDUC0I94iwPXBq';
            request.admin = admin;
            next();
        }
    }
});

 AdminRepository.mockImplementation(() => {
    return {
        createAdminAndRestaurant: () => {
            return admin;
        },
        get: () => {
            return admin;
        },
        update: () => {
            return admin;
        },
        findByNameAdmin: () => {
            admin._password = '$2a$15$fLlELgwhSEpDrjd8FgH7Fu7t0YGbpJp6Az7.qs6uDUC0I94iwPXBq';
            return admin;
        },
        deleteAdminAndRestaurant: () => {
            return {rows: [admin]};
        },
    }
});

const admin = new Admin({
    id: 1,
    name: 'name',
    restaurant: '1',
});

describe('test admin route', () => {
    test('test admin REGISTRATION method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/registration')
            .send({
                nameAdmin: 'any',
                nameRestaurant: 'any',
                description: 'any',
                password: 'any',
            });
        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(admin));
    });

    test('test admin LOGIN method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/login')
            .send({
                nameAdmin: 'email',
                password: '0000',
            });
        
        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(admin));
    });

    test('test admin GET method success answer', async () => {
        const adminRouter = new AdminRouter(pool);


        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/1');
        
        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(admin));
    });

    test('test admin UPDATE method success answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .put('/api/admins/1')
            .send({
                nameAdmin: 'any',
                nameRestaurant: 'any',
                description: 'any',
                password: 'any',
            });
        
        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(admin));
    });

    test('test admin DELETE method success answer', async () => {
        const userRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', userRouter.router))
            .delete('/api/admins/1');

        const response = res.text;

        expect(response).toBe('name deleted');
    });
});
