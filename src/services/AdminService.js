import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import AdminRepository from '../repositiories/AdminRepository.js';
import RestaurantRepository from '../repositiories/RestaurantRepository.js';
import DishRepository from '../repositiories/DishRepository.js';

class AdminService {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.createDish = this.createDish.bind(this);
        this.getAllDishes = this.getAllDishes.bind(this);
        this.getDish = this.getDish.bind(this);
        this.updateDish = this.updateDish.bind(this);
        this.deleteDish = this.deleteDish.bind(this);

        this.adminRepository = new AdminRepository(pool);
        this.restaurantRepository = new RestaurantRepository(pool);
        this.dishRepository = new DishRepository(pool);
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

    async login( { nameAdmin, password } ) {
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

    async update({
        nameAdmin, password, nameRestaurant, description, id, admin
    }) {
        try {
            if (admin !== undefined && admin.id == id) {
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
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({
        id, admin
    }) {
        try {
            if (admin !== undefined && admin.id == id) { 
                const restaurant = await this.adminRepository.deleteAdminAndRestaurant(id);
                return `${restaurant.rows[0].name} deleted`;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async createDish({
        id, description, price, category, admin
    }) {
        try {
            if (admin !== undefined && admin.id == id) {
                const dish = await this.dishRepository.create({ id, description, price, category });
                return dish;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getAllDishes({ id, admin }) {
        try {
            if (admin !== undefined && admin.id == id) {
                const allDishes = await this.dishRepository.findAllByAdminId({ id });
                return allDishes;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async getDish({ id, dish_id, admin }) {
        try {
            if (admin !== undefined && admin.id == id) {
                const dish = await this.dishRepository.findByDish_Id({ id, dish_id });
                return dish;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async updateDish({
        id, description, price, category, dish_id, admin
    }) {
        try {
            if (admin !== undefined && admin.id == id) {
                const dish = await this.dishRepository.update({ id, description, price, category, dish_id });
                return dish;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async deleteDish({ id, dish_id, admin }) {
        try {
            if (admin !== undefined && admin.id == id) {
                const dish = await this.dishRepository.delete({ id, dish_id });
                return `${dish.rows[0].description} deleted`;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }
}

export default AdminService;
