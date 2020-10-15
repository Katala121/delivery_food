import express from 'express';
import Auth from '../authentication/Auth.js';
import UserController from '../controllers/UserController.js';
import AvatarUpload from '../files/AvatarUpload.js';
import multer from 'multer';

class UserRouter {
    constructor(pool) {
        this._router = express.Router();

        this._auth = new Auth();
        this._userController = new UserController(pool);
        this._avatarUpload = new AvatarUpload();

        this._router.route('/registration').post(this._userController.registration);
        this._router.route('/login').post(this._userController.login);

        this._router.use('/:id', this._auth.checkUser);
        this._router.route('/:id').get(this._userController.getUser);
        this._router.route('/:id').put(this._userController.update);
        this._router.route('/:id').delete(this._userController.delete);
        // this._router.route('/:id/avatar').post(this.upload, (req, res) => {
        //     console.log('loaded');
        //     // реализовать обработку аватарки и добавить путь к ней в базу данных!!!
        //     res.send('Uploaded');
        // });

        this._router.use('/:id/basket', this._auth.checkUser);
        this._router.route('/:id/basket').get(this._userController.getBasket);
        this._router.use('/:id/basket/:dish_id', this._auth.checkUser);
        this._router.route('/:id/basket/:dish_id').post(this._userController.addDishInBasket);
        this._router.route('/:id/basket/:dish_id').delete(this._userController.deleteDishFromBasket);

        // this._router.use('/:id/orders', this._auth.checkUser);
        this._router.route('/:id/orders').get(this._userController.getOrders);
        this._router.route('/:id/orders').post(this._userController.createOrder);

        // this._router.use('/:id/address', this._auth.checkUser);
        this._router.route('/:id/address').get(this._userController.getAddress);
        this._router.route('/:id/address').post(this._userController.createAddress);
        this._router.route('/:id/address').put(this._userController.updateAddress);
        this._router.route('/:id/address').delete(this._userController.deleteAddress);
    }

    get router() {
        return this._router;
    }
}

export default UserRouter;
