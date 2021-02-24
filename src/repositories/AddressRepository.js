class AddressRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async get({ id, address_id }) {
        try {
            const addressUser = await this._pool.query(
                'SELECT * FROM public."delivery_addresses" WHERE user_id=$1 AND id=$2;',
                [id, address_id],
            );
            if (addressUser.rows.length === 0) {
                return new Error('Invalid address or user information');
            }
            return addressUser.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async create({
        id, address_name, address,
    }) {
        try {
            const addressUser = await this._pool.query(
                'INSERT INTO public."delivery_addresses" (user_id, address_name, address) VALUES ($1, $2, $3) RETURNING *;',
                [id, address_name, address],
            );
            return addressUser.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async getAll({ id }) {
        try {
            const addressesUser = await this._pool.query(
                'SELECT * FROM public."delivery_addresses" where user_id=$1;',
                [id],
            );
            return addressesUser.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async delete({ id, address_id }) {
        try {
            const addressUser = await this._pool.query(
                'DELETE FROM public."delivery_addresses" WHERE user_id=$1 AND id=$2 RETURNING address_name;',
                [id, address_id],
            );
            if (addressUser.rows.length === 0) {
                return new Error('Invalid address or user information');
            }
            return addressUser.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        id, address_id, address_name, address,
    }) {
        try {
            const addressUser = await this._pool.query(
                'UPDATE public."delivery_addresses" SET address_name=$3, address=$4 WHERE user_id=$1 AND id=$2 RETURNING *;',
                [id, address_id, address_name, address],
            );
            if (addressUser.rows.length === 0) {
                return new Error('Invalid address or user information');
            }
            return addressUser.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }
}

export default AddressRepository;
