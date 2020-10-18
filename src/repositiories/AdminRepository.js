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
                    'INSERT INTO public."admins" (name, password, restarant_idRawData) VALUES ($1, $2, $3) RETURNING *;',
                    [nameAdmin, password, restaurantRawData.rows[0].id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
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

    async update({
        nameAdmin, nameRestaurant, description, password, id,
    }) {
        try {
            let adminRawData; let
                restaurantRawData;
            await this._pool.query('BEGIN');
            try {
                adminRawData = await this._pool.query(
                    'UPDATE public."admins" SET name=$1, password=$2 WHERE id=$3 RETURNING *;',
                    [nameAdmin, password, id],
                );

                restaurantRawData = await this._pool.query(
                    'UPDATE public."restaurants" SET name=$1, description=$2 WHERE id=$3 RETURNING *;',
                    [nameRestaurant, description, adminRawData.rows[0].restaurant_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
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

    async deleteAdminAndRestaurant(id) {
        try {
            let restaurant;
            await this._pool.query('BEGIN');
            try {
                const restaurant_idRawData = await this._pool.query(
                    'SELECT restaurant_id FROM public."admins" where id=$1;',
                    [id],
                );
                const restaurantId = restaurant_idRawData.rows[0].restaurant_id;
                await this._pool.query(
                    'DELETE FROM public."favourite_restaurants" WHERE restarant_id=$1;',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_order" WHERE dish_id=(SELECT id FROM public."dishes" where restaurant_id=$1);',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."orders" WHERE restaurant_id=$1;',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_basket" WHERE dish_id=(SELECT id FROM public."dishes" where restaurant_id=$1);',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."dishes" WHERE restaurant_id=$1;',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."reviews" WHERE restaurant_id=$1;',
                    [restaurantId],
                );
                await this._pool.query(
                    'DELETE FROM public."admins" WHERE restaurant_id=$1;',
                    [restaurantId],
                );
                restaurant = await this._pool.query(
                    'DELETE FROM public."restaurants" WHERE id=$1 RETURNING name;',
                    [restaurantId],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                this._pool.query('ROLLBACK');
            }
            return restaurant;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByNameAdmin({ nameAdmin }) {
        try {
            const adminRawData = await this._pool.query(
                'SELECT * FROM public."admins" where name=$1;',
                [nameAdmin],
            );
            const admin = new Admin({
                id: adminRawData.rows[0].id,
                name: adminRawData.rows[0].name,
                restaurant: adminRawData.rows[0].restaurant_id,
            });
            admin._password = adminRawData.rows[0].password;
            return admin;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByNameAdminAndRestaurantId({ nameAdmin, restaurantId }) {
        try {
            const adminRawData = await this._pool.query(
                'SELECT * FROM public."admins" where name=$1 AND restaurant_id=$2;',
                [nameAdmin, restaurantId],
            );
            const admin = new Admin({
                id: adminRawData.rows[0].id,
                name: adminRawData.rows[0].name,
                restaurant: adminRawData.rows[0].restaurant_id,
            });
            admin._password = adminRawData.rows[0].password;
            return admin;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default AdminRepository;
