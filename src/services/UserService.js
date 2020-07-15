import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import UserRepository   from '../repositiories/UserRepository.js';
import BasketRepository  from '../repositiories/BasketRepository.js';

class UserService {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.userRepository = new UserRepository(pool);
        this.basketRepository = new BasketRepository(pool);
    }

    async registration({
        name, surname, email, password,
    }) {
        try {
            const user = await this.userRepository.createUserAndBasket({
                name, surname, email, password,
            });

            user._token = jwt.sign({
                email: user.email,
                name: user.name,
                id: user.id,
            }, user.password, {
                expiresIn: '24h',
            });
            return user;
        } catch (error) {
            throw Error(error);
        }
    }

    async login(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);

            if (bcrypt.compareSync(password, user.password) === true) {
                user._token = jwt.sign({
                    email: user.email,
                    name: user.name,
                    id: user.id,
                }, user.password, {
                    expiresIn: '24h',
                });
                return user;
            }
            return new Error('Invalid auth data');
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        id, name, surname, password, email, user,
    }) {
        try {
            if (user !== undefined && user.id === id) {
                const salt = bcrypt.genSaltSync(15);
                const hash = bcrypt.hashSync(password, salt);
                const updatedUser = await this.userRepository.update({
                    id, name, surname, password: hash, email,
                });
                return updatedUser;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({ id, user }) {
        try {
            if (user !== undefined && user.id === id) {
                await this.userRepository.deleteUserAndBasket(id);
                return `${user.name} deleted`;
            }
            return new Error('Invalid user information');
        } catch (error) {
            throw Error(error);
        }
    }
}

export default UserService;
