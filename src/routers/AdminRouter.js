import express from 'express';
import Auth from '../middleware/Auth.js';
import AdminController from '../controllers/AdminController.js';

class AdminRouter  {
    constructor(pool) {
        this._router = express.Router();

        this._auth = new Auth();
        this._adminController = new AdminController(pool);

        this._router.route('/registration').post(this._adminController.registration);
        this._router.route('/login').post(this._adminController.login);

        this._router.use('/:id', this._auth.checkAdmin);
        this._router.route('/:id').get(this._adminController.getRestaurant);
        this._router.route('/:id').put(this._adminController.updateRestaurant);
        this._router.route('/:id').delete(this._adminController.deleteRestaurant);

        this._router.route('/:id/dishes').post(this._adminController.createDish);
        this._router.route('/:id/dishes').get(this._adminController.getAllDishes);
        this._router.route('/:id/dishes/:dish_id').get(this._adminController.getDish);
        this._router.route('/:id/dishes/:dish_id').put(this._adminController.updateDish);
        this._router.route('/:id/dishes/:dish_id').delete(this._adminController.deleteDish);

        this._router.route('/:id/orders').get(this._adminController.getAllOrders);
        this._router.route('/:id/orders/:order_id').get(this._adminController.getOrder);
        this._router.route('/:id/orders/:order_id').put(this._adminController.updateOrder);

        this._router.route('/:id/reviews').get(this._adminController.getAllReviews);
    }

    get router() {
        return this._router;
    }
}

export default AdminRouter;
