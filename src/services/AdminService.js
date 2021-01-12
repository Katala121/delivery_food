import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import AdminRepository from '../repositiories/AdminRepository.js';
import RestaurantRepository from '../repositiories/RestaurantRepository.js';
import DishRepository from '../repositiories/DishRepository.js';
import OrderRepository from '../repositiories/OrderRepository.js';
import ReviewRepository from '../repositiories/ReviewRepository.js';

class AdminService {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.createDish = this.createDish.bind(this);
        this.getAllDishes = this.getAllDishes.bind(this);
        this.getDish = this.getDish.bind(this);
        this.updateDish = this.updateDish.bind(this);
        this.deleteDish = this.deleteDish.bind(this);
        this.getAllOrders = this.getAllOrders.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.getAllReviews = this.getAllReviews.bind(this);
        this.fileUpload = this.fileUpload.bind(this);

        this.adminRepository = new AdminRepository(pool);
        this.restaurantRepository = new RestaurantRepository(pool);
        this.dishRepository = new DishRepository(pool);
        this.orderRepository = new OrderRepository(pool);
        this.reviewRepository = new ReviewRepository(pool);
    }

    async registration({
        nameAdmin, password, nameRestaurant, description,
    }) {
        try {
            const admin = await this.adminRepository.createAdminAndRestaurant({
                nameAdmin, nameRestaurant, description, password,
            });

            admin._token = jwt.sign({
                restaurant_id: admin.restaurant,
                name: admin.name,
                id: admin.id,
            }, password, {
                expiresIn: '24h',
            });
            return admin;
        } catch (error) {
            throw Error(error);
        }
    }

    async login({ nameAdmin, password }) {
        try {
            const admin = await this.adminRepository.findByNameAdmin({ nameAdmin });
            if (bcrypt.compareSync(password, admin.password) === true) {
                admin._token = jwt.sign({
                    restaurant_id: admin.restaurant,
                    name: admin.name,
                    id: admin.id,
                }, admin.password, {
                    expiresIn: '24h',
                });
                return admin;
            }
            return new Error('Invalid password');
        } catch (error) {
            throw Error(error.massage);
        }
    }

    async get({ id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const restarant = await this.adminRepository.get(id);
                return restarant;    
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        nameAdmin, password, nameRestaurant, description, id, admin,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const salt = bcrypt.genSaltSync(15);
                const hash = bcrypt.hashSync(password, salt);
                const updatedAdmin = await this.adminRepository.update({
                    id, nameAdmin, nameRestaurant, password: hash, description,
                });
                updatedAdmin._token = jwt.sign({
                    restaurant_id: updatedAdmin.restaurant,
                    name: updatedAdmin.name,
                    id: updatedAdmin.id,
                }, hash, {
                    expiresIn: '24h',
                });
                return updatedAdmin;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({
        id, admin,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const restaurant = await this.adminRepository.deleteAdminAndRestaurant(id);
                return `${restaurant.rows[0].name} deleted`;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async createDish({
        id, title, description, price, category, admin,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const dish = await this.dishRepository.create({
                    id, title, description, price, category,
                });
                return dish;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getAllDishes({ id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const allDishes = await this.dishRepository.findAllByAdminId({ id });
                return allDishes;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getDish({ id, dish_id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const dish = await this.dishRepository.findByDish_Id({ id, dish_id });
                return dish;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async updateDish({
        id, title, description, price, category, dish_id, admin,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const dish = await this.dishRepository.update({
                    id, title, description, price, category, dish_id,
                });
                return dish;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async deleteDish({ id, dish_id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const dish = await this.dishRepository.delete({ id, dish_id });
                return `${dish.rows[0].title} deleted`;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getAllOrders({ id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const allOrders = await this.orderRepository.findByAdminId({ id });
                return allOrders;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getOrder({ id, order_id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const order = await this.orderRepository.getOrderForAdmin({ id, order_id });
                return order;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async updateOrder({
        id, order_id, status, admin,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const order = await this.orderRepository.updateByAdmin({ id, order_id, status });
                return order;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getAllReviews({ id, admin }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const allReviews = await this.reviewRepository.findByAdminId({ id });
                return allReviews;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }

    async fileUpload({
        id, dish_id, admin, fileSrc,
    }) {
        try {
            if (admin !== undefined && admin.id === +id) {
                const photoSrc = await this.dishRepository.fileUpload({ id, dish_id, fileSrc });
                return photoSrc;
            }
            return new Error('Invalid admin information');
        } catch (error) {
            throw Error(error);
        }
    }
}

export default AdminService;
