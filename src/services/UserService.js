import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import UserRepository   from '../repositories/UserRepository.js';
import BasketRepository  from '../repositories/BasketRepository.js';

class UserService {
    constructor(pool) {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.avatarUpload = this.avatarUpload.bind(this);

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
            }, password, {
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
            return new Error('Invalid password');
        } catch (error) {
            throw Error(error.massage);
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
                updatedUser._token = jwt.sign({
                    email: updatedUser.email,
                    name: updatedUser.name,
                    id: updatedUser.id,
                }, hash, {
                    expiresIn: '24h',
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

    async avatarUpload({ id, fileSrc }) {
        try {
            const avaterSrc = await this.userRepository.avatarUpload({ id, fileSrc });
            return avaterSrc;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default UserService;
