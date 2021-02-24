class OrderRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create({
        user_id, delivery_address_id, order_cost, restaurant_id, dishes_list,
    }) {
        try {
            let orderRawData;
            await this._pool.query('BEGIN');
            try {
                orderRawData = await this._pool.query(
                    'INSERT INTO public."orders" (user_id, delivery_address_id, order_cost, restaurant_id, order_time ) VALUES ($1, (SELECT id FROM public."delivery_addresses" WHERE id=$2 AND user_id=$1), $3, $4, (SELECT LOCALTIMESTAMP)) RETURNING *;',
                    [user_id, delivery_address_id, order_cost, restaurant_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            dishes_list.forEach(async (dish) => {
                await this._pool.query(
                    'INSERT INTO public."list_of_dishes_order" (order_id, dish_id, quantity) VALUES ($1, $2, $3);',
                    [orderRawData.rows[0].id, dish.id, dish.quantity],
                );
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_basket" WHERE basket_id=(SELECT id FROM public."baskets" where user_id=$1) AND dish_id=$2;',
                    [user_id, dish.id],
                );
            });
            return orderRawData.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async findByUserId({ user_id }) {
        try {
            const ordersRawData = await this._pool.query(
                'SELECT * FROM public."orders" WHERE user_id=$1;',
                [user_id],
            );
            if (ordersRawData.rows.length === 0) {
                return new Error('User haven`t orders');
            }
            return ordersRawData.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async findByAdminId({ id }) {
        try {
            const ordersRawData = await this._pool.query(
                'SELECT * FROM public."orders" WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" WHERE id=$1);',
                [id],
            );
            if (ordersRawData.rows.length === 0) {
                return new Error('Restaurant haven`t orders');
            }
            return ordersRawData.rows;
        } catch (error) {
            throw Error(error);
        }
    }

    async getOrder({
        user_id, order_id,
    }) {
        try {
            const orderRawData = await this._pool.query(
                'SELECT * FROM public."orders" WHERE user_id=$1 AND id=$2;',
                [user_id, order_id],
            );
            if (orderRawData.rows.length === 0) {
                return new Error('Invalid order or user information');
            }
            const order = orderRawData.rows[0];
            const listOfDishesRawData = await this._pool.query(
                'SELECT * FROM public."list_of_dishes_order" WHERE order_id=$1;',
                [order_id],
            );
            order.list_of_dishes = listOfDishesRawData.rows;
            return order;
        } catch (error) {
            throw Error(error);
        }
    }

    async getOrderForAdmin({
        id, order_id,
    }) {
        try {
            const orderRawData = await this._pool.query(
                'SELECT * FROM public."orders" WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" WHERE id=$1) AND id=$2;',
                [id, order_id],
            );
            if (orderRawData.rows.length === 0) {
                return new Error('Invalid order or admin information');
            }
            const order = orderRawData.rows[0];
            const listOfDishesRawData = await this._pool.query(
                'SELECT * FROM public."list_of_dishes_order" WHERE order_id=$1;',
                [order_id],
            );
            order.list_of_dishes = listOfDishesRawData.rows;
            return order;
        } catch (error) {
            throw Error(error);
        }
    }

    async update({
        user_id, delivery_address_id, order_cost, restaurant_id, dishes_list, order_id,
    }) {
        try {
            let orderRawData;
            await this._pool.query('BEGIN');
            try {
                orderRawData = await this._pool.query(
                    'UPDATE public."orders" SET user_id=$1, delivery_address_id=(SELECT id FROM public."delivery_addresses" WHERE id=$2 AND user_id=$1), order_cost=$3, restaurant_id=$4 WHERE id=$5 RETURNING *;',
                    [user_id, delivery_address_id, order_cost, restaurant_id, order_id],
                );
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_order" WHERE order_id=$1;',
                    [order_id],
                );
                await this._pool.query('COMMIT');
            } catch (error) {
                console.log(error);
                this._pool.query('ROLLBACK');
            }
            dishes_list.forEach(async (dish) => {
                await this._pool.query(
                    'INSERT INTO public."list_of_dishes_order" (order_id, dish_id, quantity) VALUES ($1, $2, $3) RETURNING *;',
                    [order_id, dish.id, dish.quantity],
                );
                await this._pool.query(
                    'DELETE FROM public."list_of_dishes_basket" WHERE basket_id=(SELECT id FROM public."baskets" where user_id=$1) AND dish_id=$2;',
                    [user_id, dish.id],
                );
            });
            return orderRawData.rows[0];
        } catch (error) {
            throw Error(error);
        }
    }

    async updateByAdmin({ id, order_id, status }) {
        try {
            const orderRawData = await this._pool.query(
                'UPDATE public."orders" SET status=$3 WHERE restaurant_id=(SELECT restaurant_id FROM public."admins" WHERE id=$1) AND id=$2 RETURNING *;',
                [id, order_id, status],
            );
            if (orderRawData.rows.length === 0) {
                return new Error('Invalid order or admin information');
            }
            const order = orderRawData.rows[0];
            const listOfDishesRawData = await this._pool.query(
                'SELECT * FROM public."list_of_dishes_order" WHERE order_id=$1;',
                [order_id],
            );
            order.list_of_dishes = listOfDishesRawData.rows;
            return order;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default OrderRepository;
