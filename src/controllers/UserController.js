import bcrypt           from 'bcryptjs';
import UserService   from '../services/UserService.js';
import OrderRepository  from '../repositories/OrderRepository.js';
import BasketRepository  from '../repositories/BasketRepository.js';
import AddressRepository  from '../repositories/AddressRepository.js';
import RestaurantRepository  from '../repositories/RestaurantRepository.js';
import ReviewRepository  from '../repositories/ReviewRepository.js';

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
        this.getOrder = this.getOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.getAllAddresses = this.getAllAddresses.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.createReview = this.createReview.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.getReview = this.getReview.bind(this);
        this.updateReview = this.updateReview.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
        this.avatarUpload = this.avatarUpload.bind(this);

        this.userService = new UserService(pool);
        this.orderRepository = new OrderRepository(pool);
        this.basketRepository = new BasketRepository(pool);
        this.addressRepository = new AddressRepository(pool);
        this.restaurantRepository = new RestaurantRepository(pool);
        this.reviewRepository = new ReviewRepository(pool);
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
        const { id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const orders = await this.orderRepository.findByUserId({
                    user_id: id,
                });
                if (orders.message) {
                    response.send(orders.message);
                } else response.send(orders);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get orders error'));
        }
    }


    async createOrder(request, response, next) {
        const { id } = request.params;
        const { delivery_address_id } = request.body;
        const { order_cost } = request.body;
        const { restaurant_id } = request.body;
        const { dishes_list } = request.body;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const order = await this.orderRepository.create({
                    user_id: id, delivery_address_id, order_cost, restaurant_id, dishes_list,
                });
                if (order.message) {
                    response.send(order.message);
                } else response.send(order);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Create order error'));
        }
    }

    async getOrder(request, response, next) {
        const { id } = request.params;
        const { order_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const orders = await this.orderRepository.getOrder({
                    user_id: id, order_id,
                });
                if (orders.message) {
                    response.send(orders.message);
                } else response.send(orders);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get order error'));
        }
    }

    async updateOrder(request, response, next) {
        const { id } = request.params;
        const { order_id } = request.params;
        const { delivery_address_id } = request.body;
        const { order_cost } = request.body;
        const { restaurant_id } = request.body;
        const { dishes_list } = request.body;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const order = await this.orderRepository.update({
                    user_id: id, delivery_address_id, order_cost, restaurant_id, dishes_list, order_id,
                });
                if (order.message) {
                    response.send(order.message);
                } else response.send(order);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Update order error'));
        }
    }

    async createAddress(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { address_name } = request.body;
        const { address } = request.body;
        try {
            if (user !== undefined && user.id === id) {
                const addressUser = await this.addressRepository.create({ id, address_name, address });
                if (address.message) {
                    response.send(addressUser.message);
                } else response.send(addressUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Add user address error'));
        }
    }

    async getAllAddresses(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const addressesUser = await this.addressRepository.getAll({ id });
                if (addressesUser.message) {
                    response.send(addressesUser.message);
                } else response.send(addressesUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get all addresses error'));
        }
    }

    async getAddress(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { address_id } = request.params;
        try {
            if (user !== undefined && user.id === id) {
                const addressUser = await this.addressRepository.get({ id, address_id });
                if (addressUser.message) {
                    response.send(addressUser.message);
                } else response.send(addressUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get address error'));
        }
    }


    async updateAddress(request, response, next) {
        const { id } = request.params;
        const { address_id } = request.params;
        const { user } = request;
        const { address_name } = request.body;
        const { address } = request.body;
        try {
            if (user !== undefined && user.id === id) {
                const addressUser = await this.addressRepository.update({
                    id, address_id, address_name, address,
                });
                if (addressUser.message) {
                    response.send(addressUser.message);
                } else response.send(addressUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Update address error'));
        }
    }

    async deleteAddress(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { address_id } = request.params;
        try {
            if (user !== undefined && user.id === id) {
                const addressUser = await this.addressRepository.delete({ id, address_id });
                if (addressUser.message) {
                    response.send(addressUser.message);
                } else response.send(addressUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Delete address error'));
        }
    }

    async createReview(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        const { review } = request.body;
        const { rating } = request.body;
        try {
            if (user !== undefined && user.id === id) {
                const reviewOfRestaurant = await this.reviewRepository.create({
                    id, restaurant_id, review, rating,
                });
                if (reviewOfRestaurant.message) {
                    response.send(reviewOfRestaurant.message);
                } else response.send(reviewOfRestaurant);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Add review error'));
        }
    }

    async getReviews(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        try {
            if (user !== undefined && user.id === id) {
                const reviews = await this.reviewRepository.findByRestaurantId({ restaurant_id });
                if (reviews.message) {
                    response.send(reviews.message);
                } else response.send(reviews);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get reviews error'));
        }
    }

    async getReview(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        const { review_id } = request.params;
        try {
            if (user !== undefined && user.id === id) {
                const review = await this.reviewRepository.get({
                    restaurant_id, review_id,
                });
                if (review.message) {
                    response.send(review.message);
                } else response.send(review);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get review error'));
        }
    }

    async updateReview(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        const { review } = request.body;
        const { rating } = request.body;
        const { review_id } = request.params;
        try {
            if (user !== undefined && user.id === id) {
                const reviewOfRestaurant = await this.reviewRepository.update({
                    restaurant_id, review, review_id, rating,
                });
                if (reviewOfRestaurant.message) {
                    response.send(reviewOfRestaurant.message);
                } else response.send(reviewOfRestaurant);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Update review error'));
        }
    }

    async deleteReview(request, response, next) {
        const { id } = request.params;
        const { restaurant_id } = request.params;
        const { user } = request;
        const { review_id } = request.params;
        try {
            if (user !== undefined && user.id === id) {
                const review = await this.reviewRepository.delete({
                    restaurant_id, review_id,
                });
                if (review.message) {
                    response.send(review.message);
                } else response.send(review);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Delete review error'));
        }
    }

    async avatarUpload(request, response, next) {
        const { id } = request.params;
        const { user } = request;

        try {
            if (user !== undefined && user.id === id) {
                if (request.file === undefined) {
                    response.send('File wasn\'t recieve!');
                }
                const fileSrc = request.file.path.split('/').slice(1).join('/');
                const avatarSrc = await this.userService.avatarUpload({ id, fileSrc });
                if (avatarSrc.message) {
                    response.send(avatarSrc.message);
                } else response.send(avatarSrc);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Upload error!'));
        }
    }
}

export default UserController;
