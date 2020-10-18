import bcrypt           from 'bcryptjs';
import UserService   from '../services/UserService.js';
import OrderRepository  from '../repositiories/OrderRepository.js';
import BasketRepository  from '../repositiories/BasketRepository.js';
import AddressRepository  from '../repositiories/AddressRepository.js';
import RestaurantRepository  from '../repositiories/RestaurantRepository.js';

class UserController {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getBasket = this.getBasket.bind(this);
        this.addDishInBasket = this.addDishInBasket.bind(this);
        this.deleteDishFromBasket = this.deleteDishFromBasket.bind(this);
        this.getFavouriteRestaurants = this.getFavouriteRestaurants.bind(this);
        this.addFavouriteRestaurant = this.addFavouriteRestaurant.bind(this);
        this.deleteFavouriteRestaurant = this.deleteFavouriteRestaurant.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);

        this.userService = new UserService(pool);
        this.orderRepository = new OrderRepository(pool);
        this.basketRepository = new BasketRepository(pool);
        this.addressRepository = new AddressRepository(pool);
        this.restaurantRepository = new RestaurantRepository(pool);
    }

    async registration(request, response, next) {
        const { name } = request.body;
        const { surname } = request.body;
        const { password } = request.body;
        const { email } = request.body;

        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(password, salt);

        try {
            const user = await this.userService.registration({
                name, surname, email, password: hash,
            });
            if (user.message) {
                response.send(user.message);
            } else response.send(user);
        } catch (error) {
            next(new Error(error));
        }
    }

    async login(request, response, next) {
        const { email } = request.body;
        const { password } = request.body;

        try {
            const user = await this.userService.login(email, password);
            if (user.message) {
                response.send(user.message);
            } else response.send(user);
        } catch (error) {
            next(new Error('Login error!!!'));
        }
    }

    async getUser(request, response, next) {
        const { id } = request.params;
        const { user } = request;

        if (user !== undefined && user.id === id) {
            response.json(user);
        } else {
            next(new Error('Invalid user information'));
        }
    }

    async update(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { name } = request.body;
        const { surname } = request.body;
        const { email } = request.body;
        const { password } = request.body;

        try {
            const updatedUser = await this.userService.update({
                id, name, surname, password, email, user,
            });
            if (updatedUser.message) {
                response.send(updatedUser.message);
            } else response.send(updatedUser);
        } catch (error) {
            next(new Error('Update error'));
        }
    }

    async delete(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        try {
            const res = await this.userService.delete({ id, user });
            if (res.message) {
                response.send(res.message);
            } else response.send(res);
        } catch (error) {
            next(new Error('Delete error'));
        }
    }

    async getBasket(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const basketUser = await this.basketRepository.get(id);
                if (basketUser.message) {
                    response.send(basketUser.message);
                } else response.send(basketUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get basket error'));
        }
    }

    async addDishInBasket(request, response, next) {
        const { id } = request.params;
        const { dish_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const basketUser = await this.basketRepository.addDishInBasket({ id, dish_id });
                if (basketUser.message) {
                    response.send(basketUser.message);
                } else response.send(basketUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Add dish in basket error'));
        }
    }

    async deleteDishFromBasket(request, response, next) {
        const { id } = request.params;
        const { dish_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const basketUser = await this.basketRepository.deleteDishFromBasket({ id, dish_id });
                if (basketUser.message) {
                    response.send(basketUser.message);
                } else response.send(basketUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Delete dish from basket error'));
        }
    }

    async getFavouriteRestaurants(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const favouriteRestaurantsOfUser = await this.restaurantRepository.getFavoriteOfUser(id);
                if (favouriteRestaurantsOfUser.message) {
                    response.send(favouriteRestaurantsOfUser.message);
                } else response.send(favouriteRestaurantsOfUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get favourite restaurants error'));
        }
    }

    async addFavouriteRestaurant(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const restaurant = await this.restaurantRepository.addFavouriteRestaurant({ id, restaurant_id });
                if (restaurant.message) {
                    response.send(restaurant.message);
                } else response.send(restaurant);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Add favourite restaurant error'));
        }
    }

    async deleteFavouriteRestaurant(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const restaurant = await this.restaurantRepository.deleteFavouriteRestaurant({ id, restaurant_id });
                if (restaurant.message) {
                    response.send(restaurant.message);
                } else response.send(restaurant);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Delete favourite restaurant error'));
        }
    }


    async getOrders(request, response, next) {
        try {
            const getedOrders = await this.orderRepository.get();
            response.send(getedOrders);
        } catch (error) {
            next(new Error('Get order error'));
        }
    }


    async createOrder(request, response, next) {
        try {
            const getedOrder = await this.orderRepository.create();
            response.send(getedOrder);
        } catch (error) {
            next(new Error('Create order error'));
        }
    }

    async getAddress(request, response, next) {
        try {
            const address = await this.addressRepository.get();
            response.send(address);
        } catch (error) {
            next(new Error('Get address error'));
        }
    }

    async createAddress(request, response, next) {
        try {
            const address = await this.addressRepository.create();
            response.send(address);
        } catch (error) {
            next(new Error('Create address error'));
        }
    }

    async updateAddress(request, response, next) {
        try {
            const address = await this.addressRepository.update();
            response.send(address);
        } catch (error) {
            next(new Error('Update address error'));
        }
    }

    async deleteAddress(request, response, next) {
        try {
            const address = await this.addressRepository.delete();
            response.send(address);
        } catch (error) {
            next(new Error('Delete address error'));
        }
    }
}

export default UserController;
