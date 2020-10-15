import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import RestaurantRepository   from '../repositiories/RestaurantRepository.js';

class RestaurantService {
    constructor(pool) {
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.restaurantRepository = new RestaurantRepository(pool);
    }

    async get (id) {
        try {
            const restarant = await this.restaurantRepository.findByRestaurantId(id);
            return restarant;
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
}

export default RestaurantService;
