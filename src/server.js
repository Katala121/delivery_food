import express          from 'express';
import process          from 'process';
import UserRouter       from './Routers/UserRouter.js';
import AdminRouter      from './Routers/AdminRouter.js';
import RestaurantRouter from './Routers/RestaurantRouter.js';
import pool           from './database.js';

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    console.log(`Server started on port ${server.address().port}`);

    await pool.connect();
    

    app.use(express.json());

    const userRouter = new UserRouter(pool);
    app.use('/api/users', userRouter.router);

    const adminRouter = new AdminRouter(pool);
    app.use('/api/admins', adminRouter.router);

    const restaurantRouter = new RestaurantRouter(pool);
    app.use('/api/restaurants', restaurantRouter.router);

    app.use((error, request, response, next) => {
        console.log(error.stack);
        console.log(error.message);
        response.status(500).send(error.message);
    })
});
