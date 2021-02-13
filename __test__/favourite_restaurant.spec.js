import express from 'express';
import request  from 'supertest';
import UserRouter from '../src/routers/UserRouter.js';
import RestaurantRepository from '../src/repositories/RestaurantRepository.js';
import User from '../src/models/User.js';
import auth from '../src/middleware/Auth.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../src/repositories/RestaurantRepository.js');
jest.mock('../src/middleware/Auth.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

RestaurantRepository.mockImplementation(() => {
    return {
        getFavoriteOfUser: () => {
            return restaurant;
        },
        addFavouriteRestaurant: () => {
            return restaurant;
        },
        deleteFavouriteRestaurant: () => {
            return restaurant;
        },
    }
});

const restaurant = [
    {
        "id": 1,
        "name": "Sushi Master",
        "description": "Ресторан Суши"
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

describe('test favourite restaurant route', () => {
    test('test favourite restaurant GET method success answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/1/favourite_restaurants');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(restaurant));
    });

    test('test favourite restaurant POST method success answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/1/favourite_restaurants/1');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(restaurant));
    });

    test('test favourite restaurant DELETE method success answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .delete('/api/users/1/favourite_restaurants/1');

        const response = res.body;

        expect(JSON.stringify(response)).toBe(JSON.stringify(restaurant));
    });
});