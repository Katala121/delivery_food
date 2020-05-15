import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
// import { transformSync } from '@babel/core';
import UserRepository   from '../Repositiories/UserRepository.js';
import OrderRepository  from '../Repositiories/OrderRepository.js';
import BasketRepository  from '../Repositiories/BasketRepository.js';
import AddressRepository  from '../Repositiories/AddressRepository.js';

class UserController {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getBasket = this.getBasket.bind(this);
        this.updateBasket = this.updateBasket.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);

        this.userRepository = new UserRepository(pool);
        this.orderRepository = new OrderRepository(pool);
        this.basketRepository = new BasketRepository(pool);
        this.addressRepository = new AddressRepository(pool);
    }

    async registration(request, response, next) {
        const { name } = request.body;
        const { surname } = request.body;
        const { password } = request.body;
        const { email } = request.body;

        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(password, salt);

        try {
            const user = await this.userRepository.create({
                name, surname, email, password: hash,
            });

            await this.basketRepository.create({ id: user.id });

            user._token = jwt.sign({
                email: user.email,
                name: user.name,
                id: user.id,
            }, hash, {
                expiresIn: '24h',
            });

            response.send(user);
        } catch (error) {
            next(new Error(error));
        }
    }

    async login(request, response, next) {
        const { email } = request.body;
        const { password } = request.body;

        const user = await this.userRepository.findByEmail(email);

        if (bcrypt.compareSync(password, user.password) === true) {
            user._token = jwt.sign({
                email: user.email,
                name: user.name,
                id: user.id,
            }, user.password, {
                expiresIn: '24h',
            });

            response.send(user);
        } else {
            next(new Error('Invalid auth data'));
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
        response.send('user');
    }

    async update(request, response, next) {
        const { id } = request.params;
        const { user } = request;
        const { name } = request.body;
        const { surname } = request.body;
        const { email } = request.body;
        const { password } = request.body;

        try {
            if (user !== undefined && user.id === id) {
                const salt = bcrypt.genSaltSync(15);
                const hash = bcrypt.hashSync(password, salt);
                const updatedUser = await this.userRepository.update({
                    id, name, surname, password: hash, email,
                });
                response.send(updatedUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Update error'));
        }
    }

    async delete(request, response, next) {
        try {
            const { id } = request.params;
            const { user } = request;
            if (user !== undefined && user.id === id) {
                await this.basketRepository.delete(id);
                await this.userRepository.delete(id);
                response.send(`${user.name} deleted`);
            } else {
                next(new Error('Invalid user information'));
            }
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
                response.send(basketUser);
            } else {
                next(new Error('Invalid user information'));
            }
        } catch (error) {
            next(new Error('Get basket error'));
        }
    }

    async updateBasket(request, response, next) {
        // const { id } = request.params;
        // const { user } = request;
        try {
            // if (user !== undefined && user.id === id) {
            const basketUser = await this.basketRepository.update();
            response.send(basketUser);
            // } else {
            //     next(new Error('Invalid user information'));
            // }
        } catch (error) {
            next(new Error('Update basket error'));
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
