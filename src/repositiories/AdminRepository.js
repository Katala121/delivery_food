import Admin from '../models/Admin.js';

class AdminRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async createAdminAndRestaurant({
        nameAdmin, nameRestaurant, description, password,
    }) {
        try {
            let adminRawData; let
                restaurantRawData;
            await this._pool.query('BEGIN');
            try {
                restaurantRawData = await this._pool.query(
                    'INSERT INTO public."restaurants" (name, description) VALUES ($1, $2) RETURNING *;',
                    [nameRestaurant, description],
                );
                adminRawData = await this._pool.query(
                    'INSERT INTO public."admins" (name, password, restaurant) VALUES ($1, $2, $3) RETURNING *;',
                    [nameAdmin, password, restaurantRawData.rows[0].id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                this._pool.query('ROLLBACK');
            }
            return new Admin({
                id: adminRawData.rows[0].id,
                name: adminRawData.rows[0].name,
                restaurant: restaurantRawData.rows[0].id,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async update() {
        return 'update admin';
    }

    async delete() {
        return 'deleted admin';
    }

    async get() {
        return 'get admin';
    }

    async findByRestarantId() {
        return 'admin';
    }
}

export default AdminRepository;
