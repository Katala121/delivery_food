import express from 'express';
import request  from 'supertest';
import AdminRouter from '../../src/routers/AdminRouter.js';
import AdminRepository from '../../src/repositories/AdminRepository.js';
import Admin from '../../src/models/Admin.js';
import auth from '../../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/AdminRepository.js');
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

 AdminRepository.mockImplementation(() => {
    return {
        createAdminAndRestaurant: () => {
            return new Error('A restaurant with this name already exists');
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
    test('test admin REGISTRATION method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/registration')
            .send({
                nameAdmin: 'any',
                nameRestaurant: 'any',
                description: 'any',
                password: 'any',
            });
        const response = res.text;

        expect(response).toBe('A restaurant with this name already exists');
    });

    test('test admin LOGIN method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/login')
            .send({
                nameAdmin: 'email',
                password: '1111',
            });
        
        const response = res.text;

        expect(response).toBe('Invalid password');
    });

    test('test admin GET method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);


        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/2');
        
        const response = res.text.indexOf('Invalid admin information');
    
        expect(response);
    });

    test('test admin UPDATE method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .put('/api/admins/2')
            .send({
                nameAdmin: 'any',
                nameRestaurant: 'any',
                description: 'any',
                password: 'any',
            });
        
        const response = res.text.indexOf('Invalid admin information');
    
        expect(response);
    });

    test('test admin DELETE method ERROR answer', async () => {
        const userRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', userRouter.router))
            .delete('/api/admins/2');

        const response = res.text.indexOf('Invalid admin information');
    
        expect(response);
    });
});
