import Dish from '../models/Dish.js';

class DishRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({
        id, title, description, price, category,
    }) {
        try {
            let dishRawData; let
                categoryRawData;
            await this._pool.query('BEGIN');
            try {
                await this._pool.query(
                    'INSERT INTO public."categories" (category) SELECT $1::character varying(200)  WHERE NOT EXISTS (SELECT id FROM public."categories" WHERE category=$1) RETURNING id;',
                    [category],
                );
                dishRawData = await this._pool.query(
                    'INSERT INTO public."dishes" (title, description, photo_link, price, category_id, restaurant_id) VALUES ($1, $2, $6, $3, (SELECT id FROM public."categories" WHERE category = $4), (SELECT restaurant_id FROM public."admins" where id=$5)) RETURNING *;',
                    [title, description, price, category, id, 'link'],
                );
                categoryRawData = await this._pool.query(
                    'SELECT category FROM public."categories" where id=$1;',
                    [dishRawData.rows[0].category_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Dish({
                id: dishRawData.rows[0].id,
                title: dishRawData.rows[0].title,
                description: dishRawData.rows[0].description,
                photo_link: dishRawData.rows[0].photo_link,
                price: dishRawData.rows[0].price,
                category: categoryRawData.rows[0].category,
            });
        } catch (error) {
                throw Error(error);
        }
    }

    async findAllByAdminId({ id }) {
        try {
            let dishesRawData;
            await this._pool.query('BEGIN');
            try {
                dishesRawData = await this._pool.query(
                    'SELECT * FROM public."dishes" where restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$1);',
                    [id],
                );
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return dishesRawData.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByDish_Id({ id, dish_id }) {
        try {
            const dish = await this._pool.query(
                'SELECT * FROM public."dishes" where id=$1 and restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$2);',
                [dish_id, id],
            );
            if (dish.rows.length === 0) {
                return new Error('Invalid dish or admin information');
            }
            return new Dish({
                id: dish.rows[0].id,
                title: dish.rows[0].title,
                description: dish.rows[0].description,
                photo_link: dish.rows[0].photo_link,
                price: dish.rows[0].price,
                category: dish.rows[0].category_id,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        id, title, description, price, category, dish_id,
    }) {
        try {
            let dishRawData; let
                categoryRawData;
            await this._pool.query('BEGIN');
            try {
                await this._pool.query(
                    'INSERT INTO public."categories" (category) SELECT $1::character varying(200)  WHERE NOT EXISTS (SELECT id FROM public."categories" WHERE category=$1) RETURNING id;',
                    [category],
                );
                dishRawData = await this._pool.query(
                    'UPDATE public."dishes" SET title=$1, description=$2, price=$3, category_id=(SELECT id FROM public."categories" WHERE category=$4) WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$5) AND id=$6 RETURNING *;',
                    [title, description, price, category, id, dish_id],
                );

                if (dishRawData.rows.length === 0) {
                    return new Error('Invalid dish or admin information');
                }

                categoryRawData = await this._pool.query(
                    'SELECT category FROM public."categories" where id=$1;',
                    [dishRawData.rows[0].category_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Dish({
                id: dishRawData.rows[0].id,
                title: dishRawData.rows[0].title,
                description: dishRawData.rows[0].description,
                photo_link: dishRawData.rows[0].photo_link,
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
                'DELETE FROM public."dishes" WHERE id=$1 AND restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$2) RETURNING *;',
                [dish_id, id],
            );
            if (dish.rows.length === 0) {
                return new Error('Invalid dish or admin information');
            }
            return dish;
        } catch (error) {
            throw Error(error);
        }
    }

    async fileUpload({ id, dish_id, fileSrc }) {
        try {
            const dishRawData = await this._pool.query(
                'UPDATE public."dishes" SET photo_link=$3 WHERE id=$2 AND restaurant_id=(SELECT restaurant_id FROM public."admins" where id=$1) RETURNING *;',
                [id, dish_id, fileSrc],
            );
            if (dishRawData.rows.length === 0) {
                return new Error('Invalid dish or admin information');
            }
            return dishRawData.rows[0].photo_link;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default DishRepository;
