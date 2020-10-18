import bcrypt           from 'bcryptjs';
// import jwt              from 'jsonwebtoken';
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
        this.getOrder = this.getOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
        this.createDish = this.createDish.bind(this);
        this.getAllDishes = this.getAllDishes.bind(this);
        this.getDish = this.getDish.bind(this);
        this.updateDish = this.updateDish.bind(this);
        this.deleteDish = this.deleteDish.bind(this);

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

    async getOrder(request, response) {
        const order = await this.orderRepository.get();

        response.send(order);
    }

    async updateOrder(request, response) {
        const order = await this.orderRepository.update();

        response.send(order);
    }

    async deleteOrder(request, response) {
        const order = await this.orderRepository.delete();

        response.send(order);
    }
}

export default AdminController;
