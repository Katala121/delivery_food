import express from 'express';
import RestaurantController from '../Controllers/RestaurantController.js';

class RestaurantRouter  {
    constructor() {
        this._router = express.Router();

        this._restaurantController = new RestaurantController();

        this._router.route('/').get(this._restaurantController.getRestaurants);
        this._router.route('/:id').get(this._restaurantController.getRestaurant);
        this._router.route('/:id/reviews').get(this._restaurantController.getReviews);
        this._router.route('/:id/menu').get(this._restaurantController.getMenu);
    }

    get router() {
        return this._router;
    }
}

export default RestaurantRouter;
