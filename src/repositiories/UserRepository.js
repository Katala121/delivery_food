import User from '../models/User.js';

class UserRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async createUserAndBasket({
        name, surname, email, password,
    }) {
        try {
            let userRawData;
            await this._pool.query('BEGIN');
            try {
                userRawData = await this._pool.query(
                    'INSERT INTO public."users" (email, name, surname, password) VALUES ($1, $2, $3, $4) RETURNING *;',
                    [email, name, surname, password],
                );
                console.log(userRawData);
                await this._pool.query(
                    'INSERT INTO public."baskets" (user_id) VALUES ($1) RETURNING id;',
                    [userRawData.rows[0].id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            return new User({
                id: userRawData.rows[0].id,
                name: userRawData.rows[0].name,
                surname: userRawData.rows[0].surname,
                email: userRawData.rows[0].email,
            });
        } catch (error) {
            throw Error(error);
        }
    }

    async findByEmail(email) {
        try {
            const userRawData = await this._pool.query(
                'SELECT * FROM public."users" where email=$1;',
                [email],
            );

            const user = new User({
                id: userRawData.rows[0].id,
                name: userRawData.rows[0].name,
                surname: userRawData.rows[0].surname,
                email: userRawData.rows[0].email,
                photo: userRawData.rows[0].photo,
            });
            user._password = userRawData.rows[0].password;

            return user;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByEmailAndId({ id, email }) {
        try {
            const userRawData = await this._pool.query(
                'SELECT * FROM public."users" where id=$1 AND email=$2;',
                [id, email],
            );

            const user = new User({
                id: userRawData.rows[0].id,
                name: userRawData.rows[0].name,
                surname: userRawData.rows[0].surname,
                email: userRawData.rows[0].email,
                photo: userRawData.rows[0].photo,
            });
            user._password = userRawData.rows[0].password;

            return user;
        } catch (error) {
            throw Error('Database error');
        }
    }

    async update({
        id, name, surname, password, email,
    }) {
        try {
            const userRawData = await this._pool.query('UPDATE public."users" SET name=$2, surname=$3, password=$4, email=$5 WHERE id=$1 RETURNING *;',
                [id, name, surname, password, email]);

            return new User({
                id: userRawData.rows[0].id,
                name: userRawData.rows[0].name,
                surname: userRawData.rows[0].surname,
                email: userRawData.rows[0].email,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteUserAndBasket(id) {
        try {
            await this._pool.query('BEGIN');
            try {
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_basket" WHERE basket_id=(SELECT id FROM public."baskets" where user_id=$1);',
                    [id],
                );
                await this._pool.query(
                    'DELETE FROM public."baskets" WHERE user_id=$1;',
                    [id],
                );
                await this._pool.query(
                    'DELETE FROM public."users" WHERE id=$1;',
                    [id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                this._pool.query('ROLLBACK');
            }
            return id;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default UserRepository;
