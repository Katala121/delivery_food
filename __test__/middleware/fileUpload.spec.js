import express from 'express';
import request  from 'supertest';
import auth from '../../src/middleware/Auth.js';
import UserRouter from '../../src/routers/UserRouter.js';
import UserService from '../../src/services/UserService.js';
import User from '../../src/models/User.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../../src/middleware/Auth.js');
jest.mock('../../src/services/UserService.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
            next();
        }
    }
});

UserService.mockImplementation(() => {
    return {
        avatarUpload: ({ id, fileSrc }) => {
            return fileSrc;
        },

    }
});

const user = new User({
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'email',
    photo:  'link'
});
user._password = '$2a$15$3mzFsJ4wV7rBuChzRPRDbOaqPXasB0ugaIM1AiCW8py0EwWymQq4S';

describe('test multer middleware', () => {
    test('test middleware AVATAR_UPLOAD method success answer', async () => {
        const userRouter = new UserRouter(pool);

        const filePath = `${__dirname}/pic.png`;

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/1/avatar')
            .attach('avatar', filePath);
        const response = res.status;

        expect(JSON.stringify(response)).toBe('200');
    });

    test('test middleware AVATAR_UPLOAD method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/1/avatar');

        const response = res.text;

        expect(response).toBe('File wasn\'t recieve!');
    });
});