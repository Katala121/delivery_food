import jwt            from 'jsonwebtoken';
import UserRepository from '../repositiories/UserRepository.js';
import AdminRepository from '../repositiories/AdminRepository.js';
import pool           from '../database.js';

class Auth {
    async checkUser(request, response, next) {
        const userRepository = new UserRepository(pool);
        try {
            if (request.headers.authorization !== undefined) {
                const token = request.headers.authorization.split(' ')[1];
                const decoded = await jwt.decode(token);
                const user = await userRepository.findByEmailAndId({
                    id: decoded.id,
                    email: decoded.email,
                });
                if (user !== null && await jwt.verify(token, user.password) !== null) {
                    request.user = user;
                    next();
                } else {
                    next(new Error('Invalid auth data'));
                }
            } else {
                next(new Error('Invalid auth data'));
            }
        } catch (e) {
            next(new Error('Invalid auth data'));
        }
    }

    async checkAdmin(request, response, next) {
        const adminRepository = new AdminRepository(pool);
        try {
            if (request.headers.authorization !== undefined) {
                const token = request.headers.authorization.split(' ')[1];
                const decoded = await jwt.decode(token);
                const admin = await adminRepository.findByNameAdminAndRestaurantId({
                    nameAdmin: decoded.name,
                    restaurantId: decoded.restaurant_id,
                });
                if (admin !== null && await jwt.verify(token, admin.password) !== null) {
                    request.admin = admin;
                    next();
                } else {
                    next(new Error('Invalid auth data'));
                }
            } else {
                next(new Error('Invalid auth data'));
            }
        } catch (e) {
            next(new Error('Invalid auth data'));
        }
    }
}

export default Auth;
