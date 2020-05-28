import RestaurantRepository   from '../repositiories/RestaurantRepository.js';
import ReviewRepository  from '../repositiories/ReviewRepository.js';
import DishRepository  from '../repositiories/DishRepository.js';

class RestaurantController {
    constructor() {
        this.getRestaurants = this.getRestaurants.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.getMenu = this.getMenu.bind(this);

        this.restaurantRepository = new RestaurantRepository();
        this.reviewRepository = new ReviewRepository();
        this.dishRepository = new DishRepository();
    }

    async getRestaurants(request, response) {
        const restaurants = await this.restaurantRepository.getAll();

        response.send(restaurants);
    }

    async getRestaurant(request, response) {
        const restaurant = await this.restaurantRepository.get();

        response.send(restaurant);
    }

    async getReviews(request, response) {
        const reviews = await this.reviewRepository.get();

        response.send(reviews);
    }

    async getMenu(request, response) {
        const menu = await this.dishRepository.get();

        response.send(menu);
    }
}

export default RestaurantController;
