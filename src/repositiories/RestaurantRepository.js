import Restaurant from '../models/Restaurant.js';

class RestaurantRepository {
    constructor(pool) {
    this._pool = pool;
    }

    async getAll() {
        return 'get restaurants';
    }

    async create() {
        return 'created restaurant';
    }

    async update() {
        return 'update restaurant';
    }

    async delete() {
        return 'deleted restaurant';
    }

    async findByRestaurantId(id) {
        try {
            const restaurantRawData = await this._pool.query(
                'SELECT * FROM public."restaurants" where id=(SELECT restaurant_id FROM public."admins" where id=$1);',
                [id],
            );
            const restaurant = new Restaurant({
                id: restaurantRawData.rows[0].id,
                name: restaurantRawData.rows[0].name,
                description: restaurantRawData.rows[0].description,
            });
            return restaurant;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default RestaurantRepository;
