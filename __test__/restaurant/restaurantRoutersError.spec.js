import express from 'express';
import request  from 'supertest';
import RestaurantRouter from '../../src/routers/RestaurantRouter.js';
import RestaurantRepository from '../../src/repositories/RestaurantRepository.js';
import ReviewRepository from '../../src/repositories/ReviewRepository.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/RestaurantRepository.js');
jest.mock('../../src/repositories/ReviewRepository.js');

RestaurantRepository.mockImplementation(() => {
    return {
        getAllRestaurants: () => {
            return new Error('Database error');
        },
        getRestaurant: () => {
            return new Error('Database error');
        },
        getMenu: () => {
            return new Error('Database error');
        },
    }
});

ReviewRepository.mockImplementation(() => {
    return {
        findByRestaurantId: () => {
            return new Error('Database error');
        },
    }
});

describe('test restaurants route', () => {
    test('test restaurants GET ALL method ERROR answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants');

        const response = res.text;

        expect(response).toBe('Database error');
    });

    test('test restaurants GET method ERROR answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1');

        const response = res.text;

        expect(response).toBe('Database error');
    });

    test('test reviews GET method ERROR answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1/reviews');

        const response = res.text;

        expect(response).toBe('Database error');
    });

    test('test menu GET method ERROR answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1/menu');

        const response = res.text;

        expect(response).toBe('Database error');
    });
});