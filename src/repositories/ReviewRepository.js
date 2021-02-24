import Review from '../models/Review.js';

class ReviewRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async get({ restaurant_id, review_id }) {
        try {
            const reviewRawData = await this._pool.query(
                'SELECT * FROM public."reviews" WHERE id=$1 AND restaurant_id=$2;',
                [review_id, restaurant_id],
            );
            if (reviewRawData.rows.length === 0) {
                return new Error('Invalid review or restaurant information');
            }
            return reviewRawData.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async create({
        id, restaurant_id, review, rating,
    }) {
        try {
            let reviewRawData;
            await this._pool.query('BEGIN');
            try {
                reviewRawData = await this._pool.query(
                    'INSERT INTO public."reviews" (review, restaurant_id, user_id, rating) VALUES ($3, $2, $1, $4) RETURNING *;',
                    [id, restaurant_id, review, rating],
                );
                const ratings = await this._pool.query(
                    'SELECT rating FROM public."reviews" WHERE restaurant_id=$1;',
                    [restaurant_id],
                );
                const ratingSum = ratings.rows.reduce((sum, row) => sum + row.rating, 0);
                const ratingRestaurant = ratingSum / ratings.rows.length;
                await this._pool.query(
                    'UPDATE public."restaurants" SET rating=$1 WHERE id=$2;',
                    [ratingRestaurant, restaurant_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Review({
                id: reviewRawData.rows[0].id,
                restaurant_id: reviewRawData.rows[0].restaurant_id,
                review: reviewRawData.rows[0].review,
                rating: reviewRawData.rows[0].rating,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async findByRestaurantId({ restaurant_id }) {
        try {
            const reviewRawData = await this._pool.query(
                'SELECT * FROM public."reviews" WHERE restaurant_id=$1;',
                [restaurant_id],
            );
            if (reviewRawData.rows.length === 0) {
                return new Error('Restaurant haven`t reviews');
            }
            return reviewRawData.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByAdminId({ id }) {
        try {
            const reviewRawData = await this._pool.query(
                'SELECT * FROM public."reviews" WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" WHERE id=$1);',
                [id],
            );
            if (reviewRawData.rows.length === 0) {
                return new Error('Restaurant haven`t reviews');
            }
            return reviewRawData.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({ restaurant_id, review_id }) {
        try {
            const reviewRawData = await this._pool.query(
                'DELETE FROM public."reviews" WHERE id=$1 AND restaurant_id=$2 RETURNING *;',
                [review_id, restaurant_id],
            );
            if (reviewRawData.rows.length === 0) {
                return new Error('Invalid review or restaurant information');
            }
            return reviewRawData.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        restaurant_id, review, review_id, rating,
    }) {
        try {
            let reviewRawData;
            await this._pool.query('BEGIN');
            try {
                reviewRawData = await this._pool.query(
                    'UPDATE public."reviews" SET review=$1, rating=$4 WHERE id=$3 AND restaurant_id=$2 RETURNING *;',
                    [review, restaurant_id, review_id, rating],
                );
                const ratings = await this._pool.query(
                    'SELECT rating FROM public."reviews" WHERE restaurant_id=$1;',
                    [restaurant_id],
                );
                const ratingSum = ratings.rows.reduce((sum, row) => sum + row.rating, 0);
                const ratingRestaurant = ratingSum / ratings.rows.length;
                await this._pool.query(
                    'UPDATE public."restaurants" SET rating=$1 WHERE id=$2;',
                    [ratingRestaurant, restaurant_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new Review({
                id: reviewRawData.rows[0].id,
                restaurant_id: reviewRawData.rows[0].restaurant_id,
                review: reviewRawData.rows[0].review,
                rating: reviewRawData.rows[0].rating,
            });
        } catch (error) {
            throw Error(error);
        }
    }
}

export default ReviewRepository;
