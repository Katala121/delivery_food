import express from 'express';
import request  from 'supertest';
import AdminRouter from '../src/routers/AdminRouter.js';
import DishRepository from '../src/repositories/DishRepository.js';
import Admin from '../src/models/Admin.js';
import Dish from '../src/models/Dish.js';
import auth from '../src/middleware/Auth.js';
import multer from '../src/middleware/FileUpload.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../src/repositories/DishRepository.js');
jest.mock('../src/middleware/Auth.js');
jest.mock('../src/middleware/FileUpload.js');

auth.mockImplementation(() => {
    return {
        checkAdmin: (request, response, next) => {
            admin._password = '$2a$15$fLlELgwhSEpDrjd8FgH7Fu7t0YGbpJp6Az7.qs6uDUC0I94iwPXBq';
            request.admin = admin;
            next();
        }
    }
});

multer.single.mockImplementation(() => {
    return (req, res, next) => {
        req.file = {
            mimetype: 'image/png',
            path: 'link',
        };
        return next();
    };
});

DishRepository.mockImplementation(() => {
    return {
        create: () => {
            return dish;
        },
        findAllByAdminId: () => {
            return dish;
        },
        findByDish_Id: () => {
            return dish;
        },
        update: () => {
            return dish;
        },
        delete: () => {
            return {rows: [dish]};
        },
        fileUpload: ({ id, dish_id, fileSrc }) => {
            return fileSrc;
        },
    }
});

const dish = new Dish({
    id: 11,
    title: 'title',
    description: 'description',
    photo_link: 'link',
    price: '110',
    category: 'category',
});

const admin = new Admin({
    id: 1,
    name: 'name',
    restaurant: '1',
});

describe('test dish route', () => {
    test('test dish POST method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/2/dishes')
            .send({
                title: "roll tempura",
                description: "roll tempura is a hot rolls",
                price: "250",
                category: "rolls"
            });

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });

    test('test dish GET ALL method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/2/dishes');

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });

    test('test dish GET method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .get('/api/admins/2/dishes/1');

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });

    test('test dish PUT method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .put('/api/admins/2/dishes/1')
            .send({
                title: "roll tempura",
                description: "roll tempura is a hot rolls",
                price: "250",
                category: "rolls"
            });

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });

    test('test dish DELETE method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .delete('/api/admins/2/dishes/1');

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });

    test('test dish AVATAR_UPLOAD method ERROR answer', async () => {
        const adminRouter = new AdminRouter(pool);

        const res = await request(app.use('/api/admins', adminRouter.router))
            .post('/api/admins/2/dishes/1/photo');

        const response = res.text;

        expect(response).toBe('Invalid admin information');
    });
});