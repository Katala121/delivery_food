// import Basket from '../Models/Basket.js';

class BasketRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async createBasket({ id }) {
        try {
            await this._pool.query(
                'INSERT INTO public."baskets" (user_id) VALUES ($1) RETURNING *;',
                [id],
            );
        } catch (error) {
            throw Error(error);
        }
    }

    async findByUserId() {
        return 'basket';
    }

    async update() {
        return 'update basket';
    }

    async delete(id) {
        try {
            await this._pool.query(
                'DELETE FROM public."baskets" WHERE user_id=$1 RETURNING *;',
                [id],
            );
        } catch (error) {
            throw Error(error);
        }
    }

    async get(id) {
        try {
            const basket = await this._pool.query(
                'SELECT dish_id, description, photo_link, price, category_id, restaurant_id FROM public."list_of_dishes_basket" JOIN public."dishes" ON public."list_of_dishes_basket".dish_id = public."dishes".id WHERE basket_id=( SELECT id FROM public."baskets" WHERE user_id=$1 );',
                [id],
            );
            return basket.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async addDishInBasket({id, dish_id}) {
        try {
            const dish_idRawData = await this._pool.query(
                'INSERT INTO public."list_of_dishes_basket" (basket_id, dish_id) VALUES ((SELECT id FROM public."baskets" WHERE user_id=$1), $2) RETURNING dish_id;',
                [id, dish_id],
            );
            return dish_idRawData.rows[0].dish_id;
        } catch (error) {
            throw Error(error);
        }
    }

    async deleteDishFromBasket({id, dish_id}) {
        try {
            const dish_idRawData = await this._pool.query(
                'DELETE FROM public."list_of_dishes_basket" WHERE dish_id=$2 AND basket_id=(SELECT id FROM public."baskets" WHERE user_id=$1) RETURNING dish_id;',
                [id, dish_id],
            );
            return dish_idRawData.rows[0].dish_id;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default BasketRepository;
