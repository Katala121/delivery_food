import Restaurant from '../models/Restaurant.js';

class RestaurantRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async getFavoriteOfUser(id) {
        try {
            const favouriteRestaurants = await this._pool.query(
                'SELECT public."restaurants".id, name, description FROM public."favourite_restaurants" JOIN public."restaurants" ON public."favourite_restaurants".restarant_id = public."restaurants".id  WHERE user_id=$1;',
                [id],
            );
            return favouriteRestaurants.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async addFavouriteRestaurant({ id, restaurant_id }) {
        try {
            const favouriteRestaurant = await this._pool.query(
                'INSERT INTO public."favourite_restaurants" (user_id, restarant_id) VALUES ($1, $2) RETURNING restarant_id;',
                [id, restaurant_id],
            );
            return favouriteRestaurant.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async deleteFavouriteRestaurant({ id, restaurant_id }) {
        try {
            const favouriteRestaurant = await this._pool.query(
                'DELETE FROM public."favourite_restaurants" WHERE user_id=$1 AND restarant_id=$2 RETURNING restarant_id;',
                [id, restaurant_id],
            );
            return favouriteRestaurant.rows[0];
        } catch (error) {
            throw Error(error);
        }
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
