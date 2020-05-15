import jwt            from 'jsonwebtoken';
import UserRepository from '../Repositiories/UserRepository.js';
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
}

export default Auth;
