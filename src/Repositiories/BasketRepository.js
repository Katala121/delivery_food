// import Basket from '../Models/Basket.js';

class BasketRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({ id }) {
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
                'SELECT * FROM public."dishes" WHERE id=( SELECT dish_id FROM public."list_of_dishes_basket" WHERE basket_id=( SELECT id FROM public."baskets" WHERE user_id=$1 ) );',
                [id],
            );
            return basket;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default BasketRepository;
