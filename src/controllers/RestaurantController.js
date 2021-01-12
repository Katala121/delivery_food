import RestaurantRepository   from '../repositiories/RestaurantRepository.js';
import ReviewRepository  from '../repositiories/ReviewRepository.js';
import DishRepository  from '../repositiories/DishRepository.js';

class RestaurantController {
    constructor(pool) {
        this.getRestaurants = this.getRestaurants.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.getMenu = this.getMenu.bind(this);

        this.restaurantRepository = new RestaurantRepository(pool);
        this.reviewRepository = new ReviewRepository(pool);
        this.dishRepository = new DishRepository(pool);
    }

    async getRestaurants(request, response, next) {
        try {
            const restaurants = await this.restaurantRepository.getAllRestaurants();
            if (restaurants.message) {
                response.send(restaurants.message);
            } else response.send(restaurants);
        } catch (error) {
            next(new Error('Get restarants error'));
        }
    }

    async getRestaurant(request, response, next) {
        const { id } = request.params;
        try {
            const restaurant = await this.restaurantRepository.getRestaurant(id);
            if (restaurant.message) {
                response.send(restaurant.message);
            } else response.send(restaurant);
        } catch (error) {
            next(new Error('Get restarant error'));
        }
    }

    async getReviews(request, response, next) {
        const { id } = request.params;
        try {
            const reviews = await this.reviewRepository.findByRestaurantId({ restaurant_id: id });
            if (reviews.message) {
                response.send(reviews.message);
            } else response.send(reviews);
        } catch (error) {
            next(new Error('Get menu error'));
        }
    }

    async getMenu(request, response, next) {
        const { id } = request.params;
        try {
            const menu = await this.restaurantRepository.getMenu(id);
            if (menu.message) {
                response.send(menu.message);
            } else response.send(menu);
        } catch (error) {
            next(new Error('Get menu error'));
        }
    }
}

export default RestaurantController;
