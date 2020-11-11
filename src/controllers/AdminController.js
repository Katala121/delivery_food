import bcrypt           from 'bcryptjs';
import OrderRepository  from '../repositiories/OrderRepository.js';
import AdminRepository  from '../repositiories/AdminRepository.js';
import AdminService  from '../services/AdminService.js';
import RestaurantService  from '../services/RestaurantService.js';

class AdminController {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.updateRestaurant = this.updateRestaurant.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
        this.getAllOrders = this.getAllOrders.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.createDish = this.createDish.bind(this);
        this.getAllDishes = this.getAllDishes.bind(this);
        this.getDish = this.getDish.bind(this);
        this.updateDish = this.updateDish.bind(this);
        this.deleteDish = this.deleteDish.bind(this);
        this.getAllReviews = this.getAllReviews.bind(this);

        this.adminService = new AdminService(pool);
        this.orderRepository = new OrderRepository(pool);
        this.restaurantService = new RestaurantService(pool);
        this.adminRepository = new AdminRepository(pool);
    }

    async registration(request, response, next) {
        const { nameAdmin } = request.body;
        const { password } = request.body;
        const { nameRestaurant } = request.body;
        const { description } = request.body;

        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(password, salt);

        try {
            const admin = await this.adminService.registration({
                nameAdmin, password: hash, nameRestaurant, description,
            });
            if (admin.message) {
                next(new Error(admin.message));
            }
            response.send(admin);
        } catch (error) {
            next(new Error(error));
        }
    }

    async login(request, response, next) {
        const { nameAdmin } = request.body;
        const { password } = request.body;

        try {
            const admin = await this.adminService.login({ nameAdmin, password });
            if (admin.message) {
                next(new Error(admin.message));
            }
            response.send(admin);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getRestaurant(request, response, next) {
        try {
            const { id } = request.params;
            const restaurant = await this.restaurantService.get(id);
            if (restaurant.message) {
                response.send(restaurant.message);
            } else response.send(restaurant);
        } catch (error) {
            next(new Error(error));
        }
    }

    async updateRestaurant(request, response, next) {
        try {
            const { nameAdmin } = request.body;
            const { password } = request.body;
            const { nameRestaurant } = request.body;
            const { description } = request.body;
            const { id } = request.params;
            const { admin } = request;
            const restaurant = await this.adminService.update({
                id, nameAdmin, password, nameRestaurant, description, admin,
            });
            if (restaurant.message) {
                response.send(restaurant.message);
            } else response.send(restaurant);
        } catch (error) {
            next(new Error(error));
        }
    }

    async deleteRestaurant(request, response, next) {
        try {
            const { id } = request.params;
            const { admin } = request;
            const restaurant = await this.adminService.delete({ id, admin });
            if (restaurant.message) {
                response.send(restaurant.message);
            } else response.send(restaurant);
        } catch (error) {
            next(new Error(error));
        }
    }

    async createDish(request, response, next) {
        const { id } = request.params;
        const { description } = request.body;
        const { price } = request.body;
        const { category } = request.body;
        const { admin } = request;
        try {
            const dish = await this.adminService.createDish({
                id, description, price, category, admin,
            });
            if (dish.message) {
                response.send(dish.message);
            } else response.send(dish);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getAllDishes(request, response, next) {
        const { id } = request.params;
        const { admin } = request;
        try {
            const allDishes = await this.adminService.getAllDishes({ id, admin });
            if (allDishes.message) {
                response.send(allDishes.message);
            } else response.send(allDishes);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getDish(request, response, next) {
        const { id } = request.params;
        const { dish_id } = request.params;
        const { admin } = request;
        try {
            const dish = await this.adminService.getDish({ id, dish_id, admin });
            if (dish.message) {
                response.send(dish.message);
            } else response.send(dish);
        } catch (error) {
            next(new Error(error));
        }
    }

    async updateDish(request, response, next) {
        const { id } = request.params;
        const { dish_id } = request.params;
        const { description } = request.body;
        const { price } = request.body;
        const { category } = request.body;
        const { admin } = request;
        try {
            const dish = await this.adminService.updateDish({
                id, description, price, category, dish_id, admin,
            });
            if (dish.message) {
                response.send(dish.message);
            } else response.send(dish);
        } catch (error) {
            next(new Error(error));
        }
    }

    async deleteDish(request, response, next) {
        const { id } = request.params;
        const { dish_id } = request.params;
        const { admin } = request;
        try {
            const dish = await this.adminService.deleteDish({ id, dish_id, admin });
            if (dish.message) {
                response.send(dish.message);
            } else response.send(dish);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getAllOrders(request, response, next) {
        const { id } = request.params;
        const { admin } = request;
        try {
            const orders = await this.adminService.getAllOrders({ id, admin });
            if (orders.message) {
                response.send(orders.message);
            } else response.send(orders);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getOrder(request, response, next) {
        const { id } = request.params;
        const { order_id } = request.params;
        const { admin } = request;
        try {
            const order = await this.adminService.getOrder({ id, order_id, admin });
            if (order.message) {
                response.send(order.message);
            } else response.send(order);
        } catch (error) {
            next(new Error(error));
        }
    }

    async updateOrder(request, response) {
        const { id } = request.params;
        const { order_id } = request.params;
        const { status } = request.body;
        const { admin } = request;
        try {
            const order = await this.adminService.updateOrder({
                id, order_id, status, admin,
            });
            if (order.message) {
                response.send(order.message);
            } else response.send(order);
        } catch (error) {
            next(new Error(error));
        }
    }

    async getAllReviews(request, response, next) {
        const { id } = request.params;
        const { admin } = request;
        try {
            const reviews = await this.adminService.getAllReviews({ id, admin });
            if (reviews.message) {
                response.send(reviews.message);
            } else response.send(reviews);
        } catch (error) {
            next(new Error(error));
        }
    }
}

export default AdminController;
