import express from 'express';
// import multer from 'multer';
import Auth from '../middleware/Auth.js';
import UserController from '../controllers/UserController.js';
import avatarUpload from '../middleware/FileUpload.js';

class UserRouter {
    constructor(pool) {
        this._router = express.Router();

        this._auth = new Auth();
        this._userController = new UserController(pool);
        // this._avatarUpload = new AvatarUpload();

        this._router.route('/registration').post(this._userController.registration);
        this._router.route('/login').post(this._userController.login);

        this._router.use('/:id', this._auth.checkUser);
        this._router.route('/:id').get(this._userController.getUser);
        this._router.route('/:id').put(this._userController.update);
        this._router.route('/:id').delete(this._userController.delete);
        this._router.route('/:id/avatar').post(avatarUpload.single('avatar'), this._userController.avatarUpload);

        this._router.use('/:id/basket', this._auth.checkUser);
        this._router.route('/:id/basket').get(this._userController.getBasket);
        this._router.use('/:id/basket/:dish_id', this._auth.checkUser);
        this._router.route('/:id/basket/:dish_id').post(this._userController.addDishInBasket);
        this._router.route('/:id/basket/:dish_id').delete(this._userController.deleteDishFromBasket);

        this._router.use('/:id/favourite_restaurants', this._auth.checkUser);
        this._router.route('/:id/favourite_restaurants').get(this._userController.getFavouriteRestaurants);
        this._router.use('/:id/favourite_restaurants/:restaurant_id', this._auth.checkUser);
        this._router.route('/:id/favourite_restaurants/:restaurant_id').post(this._userController.addFavouriteRestaurant);
        this._router.route('/:id/favourite_restaurants/:restaurant_id').delete(this._userController.deleteFavouriteRestaurant);

        this._router.use('/:id/orders', this._auth.checkUser);
        this._router.route('/:id/orders').post(this._userController.createOrder);
        this._router.route('/:id/orders').get(this._userController.getOrders);
        this._router.route('/:id/orders/:order_id').get(this._userController.getOrder);
        this._router.route('/:id/orders/:order_id').put(this._userController.updateOrder);

        this._router.use('/:id/address', this._auth.checkUser);
        this._router.route('/:id/address').post(this._userController.createAddress);
        this._router.route('/:id/address').get(this._userController.getAllAddresses);
        this._router.use('/:id/address/:address_id', this._auth.checkUser);
        this._router.route('/:id/address/:address_id').get(this._userController.getAddress);
        this._router.route('/:id/address/:address_id').put(this._userController.updateAddress);
        this._router.route('/:id/address/:address_id').delete(this._userController.deleteAddress);

        this._router.use('/:id/reviews/:restaurant_id', this._auth.checkUser);
        this._router.route('/:id/reviews/:restaurant_id').post(this._userController.createReview);
        this._router.route('/:id/reviews/:restaurant_id/:review_id').get(this._userController.getReview);
        this._router.route('/:id/reviews/:restaurant_id/:review_id').put(this._userController.updateReview);
        this._router.route('/:id/reviews/:restaurant_id/:review_id').delete(this._userController.deleteReview);
    }

    get router() {
        return this._router;
    }
}

export default UserRouter;
