import User from '../Models/User.js';

class UserRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({
        name, surname, email, password,
    }) {
        try {
            const userRawData = await this._pool.query(
                'INSERT INTO public."users" (email, name, surname, password) VALUES ($1, $2, $3, $4) RETURNING *;',
                [email, name, surname, password],
            );

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

    async delete(id) {
        try {
            await this._pool.query(
                'DELETE FROM public."users" WHERE id=$1 RETURNING *;',
                [id],
            );
        } catch (error) {
            throw Error(error);
        }
    }
}

export default UserRepository;
