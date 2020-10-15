import Dish from '../models/Dish.js';

class DishRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({
        id, description, price, category
    }) {
        try {
            let dishRawData, categoryRawData;
            await this._pool.query('BEGIN');
            try {
                dishRawData = await this._pool.query(
                    'INSERT INTO public."dishes" (description, photo_link, price, category_id, restaurant_id) VALUES ($1, $5, $2, (SELECT id FROM public."categories" where category=$3), (SELECT restaurant_id FROM public."admins" where id=$4)) RETURNING *;',
                    [description, price, category, id, "link"],
                );
                categoryRawData = await this._pool.query(
                    'SELECT category FROM public."categories" where id=$1;',
                    [dishRawData.rows[0].category_id,]
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Dish({
                id: dishRawData.rows[0].id,
                description: dishRawData.rows[0].description,
                price: dishRawData.rows[0].price,
                category: categoryRawData.rows[0].category,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async findAllByAdminId({ id }) {
        try {
            let dishesRawData, categoryRawData;
            await this._pool.query('BEGIN');
            try {
                dishesRawData = await this._pool.query(
                    'SELECT * FROM public."dishes" where restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$1);',
                    [id,]
                );
                console.log(dishesRawData.rows);
                return dishesRawData.rows.map( (dish) => {
                    return new Dish({
                        id: dish.id,
                        description: dish.description,
                        price: dish.price,
                        category: dish.category_id,
                    });
                });
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
        } catch (error) {
            throw Error(error);
        }
    }

    async findByDish_Id({ id, dish_id }) {
        try {
            const dish = await this._pool.query(
                'SELECT * FROM public."dishes" where id=$1 and restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$2);',
                [dish_id, id]
            );
            if (dish.rows.length == 0) {
                return new Error('Invalid dish or admin information');
            }
            return new Dish({
                id: dish.rows[0].id,
                description: dish.rows[0].description,
                price: dish.rows[0].price,
                category: dish.rows[0].category_id,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        id, description, price, category, dish_id
    }) {
        try {
            let dishRawData, categoryRawData;
            await this._pool.query('BEGIN');
            try {
                dishRawData = await this._pool.query(
                    'UPDATE public."dishes" SET description=$1, photo_link=$6, price=$2, category_id=(SELECT id FROM public."categories" WHERE category=$3) WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$4) AND id=$5 RETURNING *;',
                    [description, price, category, id, dish_id, "link"],
                );

                if (dishRawData.rows.length == 0) {
                    return new Error('Invalid dish or admin information');
                };

                categoryRawData = await this._pool.query(
                    'SELECT category FROM public."categories" where id=$1;',
                    [dishRawData.rows[0].category_id,]
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Dish({
                id: dishRawData.rows[0].id,
                description: dishRawData.rows[0].description,
                price: dishRawData.rows[0].price,
                category: categoryRawData.rows[0].category,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({ id, dish_id }) {
        try {
            const dish = await this._pool.query(
                'DELETE FROM public."dishes" WHERE id=$1 and restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$2) RETURNING description;',
                [dish_id, id]
            );
            if (dish.rows.length == 0) {
                return new Error('Invalid dish or admin information');
            }
            return dish;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default DishRepository;
