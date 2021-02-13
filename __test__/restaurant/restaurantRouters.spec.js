import express from 'express';
import request  from 'supertest';
import RestaurantRouter from '../../src/routers/RestaurantRouter.js';
import RestaurantRepository from '../../src/repositories/RestaurantRepository.js';
import ReviewRepository from '../../src/repositories/ReviewRepository.js';
import Dish from '../../src/models/Dish.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/repositories/RestaurantRepository.js');
jest.mock('../../src/repositories/ReviewRepository.js');

RestaurantRepository.mockImplementation(() => {
    return {
        getAllRestaurants: () => {
            return restaurant;
        },
        getRestaurant: () => {
            return restaurant;
        },
        getMenu: () => {
            return dish;
        },
    }
});

ReviewRepository.mockImplementation(() => {
    return {
        findByRestaurantId: () => {
            return review;
        },
    }
});

const restaurant = {
    "id": 1,
    "name": "Sushi Master",
    "description": "Ресторан Суши",
    "rating": 3
};

const review = {
    "id": "1",
    "restaurant_id": 1,
    "review": "normal",
    "rating": 3
};

const dish = new Dish({
    id: 11,
    title: 'title',
    description: 'description',
    photo_link: 'link',
    price: '110',
    category: 'category',
});

describe('test restaurants route', () => {
    test('test restaurants GET ALL method success answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(restaurant));
    });

    test('test restaurants GET method success answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(restaurant));
    });

    test('test reviews GET method success answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1/reviews');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(review));
    });

    test('test menu GET method success answer', async () => {
        const restaurantRouter = new RestaurantRouter(pool);

        const res = await request(app.use('/api/restaurants', restaurantRouter.router))
            .get('/api/restaurants/1/menu');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(dish));
    });
});