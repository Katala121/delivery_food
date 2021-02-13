import express from 'express';
import request  from 'supertest';
import UserRouter from '../src/routers/UserRouter.js';
import UserRepository from '../src/repositories/UserRepository.js';
import User from '../src/models/User.js';
import auth from '../src/middleware/Auth.js';
import multer from '../src/middleware/FileUpload.js';

const app = express();
app.use(express.json());

const client = { query: jest.fn(), release: jest.fn() };
const pool = { connect: jest.fn(() => client), query: jest.fn() };

jest.mock('../src/repositories/UserRepository.js');
jest.mock('../src/middleware/Auth.js');
jest.mock('../src/middleware/FileUpload.js');

auth.mockImplementation(() => {
    return {
        checkUser: (request, response, next) => {
            request.user = user;
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

UserRepository.mockImplementation(() => {
    return {
        createUserAndBasket: ({
            name, surname, email, password,
        }) => {
            return new Error('A user with this email address already exists');
        },
        findByEmail: (email) => {
            return user;
        },
        update: () => {
            return user;
        },
        deleteUserAndBasket: (id) => {
            return id;
        },
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

describe('test user route', () => {
    test('test user REGISTRATION method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/registration')
            .send({
                name: 'any',
                surname: 'any',
                email: 'any',
                password: 'any',
            });
        const response = res.text;

        expect(response).toBe('A user with this email address already exists');
    });

    test('test user LOGIN method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/login')
            .send({
                email: 'email',
                password: '000',
            });

        const response = res.text;

        expect(response).toBe('Invalid password');
    });

    test('test user GET method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);


        const res = await request(app.use('/api/users', userRouter.router))
            .get('/api/users/2');
        
        const response = res.text.indexOf('Invalid user information');
        
        expect(response);
    });

    test('test user UPDATE method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .put('/api/users/2')
            .send({
                name: 'any',
                surname: 'any',
                email: 'any',
                password: 'any',
            });
        
        const response = res.text;

        expect(response).toBe('Invalid user information');
    });

    test('test user DELETE method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .delete('/api/users/2');

        const response = res.text;

        expect(response).toBe('Invalid user information');
    });

    test('test user AVATAR_UPLOAD method ERROR answer', async () => {
        const userRouter = new UserRouter(pool);

        const res = await request(app.use('/api/users', userRouter.router))
            .post('/api/users/2/avatar');

        const response = res.text.indexOf('Invalid user information');
        
        expect(response);
    });
});