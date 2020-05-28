// import bcrypt           from 'bcryptjs';
import jwt              from 'jsonwebtoken';
import AdminRepository from '../repositiories/AdminRepository.js';
import RestaurantRepository from '../repositiories/RestaurantRepository.js';

class AdminService {
    constructor(pool) {
        this.registration = this.registration.bind(this);

        this.adminRepository = new AdminRepository(pool);
        this.restaurantRepository = new RestaurantRepository(pool);
    }

    async registration({
        nameAdmin, password, nameRestaurant, description,
    }) {
        try {
            const admin = await this.adminRepository.createAdminAndRestaurant({
                nameAdmin, nameRestaurant, description, password,
            });

            admin._token = jwt.sign({
                restaurant: admin.restaurant,
                name: admin.name,
                id: admin.id,
            }, admin.password, {
                expiresIn: '24h',
            });
            console.log(admin);
            return admin;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default AdminService;
