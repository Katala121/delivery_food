import express from 'express';
import Auth from '../authentication/Auth.js';
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

        //     // this._router.use('/:id/dishes', this._auth.checkUser);
        this._router.route('/:id/dishes').post(this._adminController.createDish);
        this._router.route('/:id/dishes').get(this._adminController.getAllDishes);
        this._router.route('/:id/dishes/:dish_id').get(this._adminController.getDish);
        this._router.route('/:id/dishes/:dish_id').put(this._adminController.updateDish);
        this._router.route('/:id/dishes/:dish_id').delete(this._adminController.deleteDish);

        //     // this._router.use('/:id/orders', this._auth.checkUser);
        this._router.route('/:id/orders').get(this._adminController.getOrder);
        this._router.route('/:id/orders').put(this._adminController.updateOrder);
        this._router.route('/:id/orders').delete(this._adminController.deleteOrder);
    }

    get router() {
        return this._router;
    }
}

export default AdminRouter;
