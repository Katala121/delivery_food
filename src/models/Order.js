class Order {
    constructor({
        id, user_id, restaurant_id, delivery_adress, order_cost,
        list_dish_order, order_time, status,
    }) {
        this._id = id;
        this._user_id = user_id;
        this._restaurant_id = restaurant_id;
        this._delivery_adress = delivery_adress;
        this._order_cost = order_cost;
        this._list_dish_order = list_dish_order;
        this._order_time = order_time;
        this._status = status;
    }

    get id() {
        return this._id;
    }

    get user_id() {
        return this._user_id;
    }

    get restaurant_id() {
        return this._restaurant_id;
    }

    get delivery_adress() {
        return this._delivery_adress;
    }

    set delivery_adress(newValue) {
        this._delivery_adress = newValue;
    }

    get order_cost() {
        return this._order_cost;
    }

    set order_cost(newValue) {
        this._order_cost = newValue;
    }

    get list_dish_order() {
        return this._list_dish_order;
    }

    set list_dish_order(newValue) {
        this._list_dish_order = newValue;
    }

    get order_time() {
        return this._order_time;
    }

    set order_time(newValue) {
        this._order_time = newValue;
    }

    get status() {
        return this._status;
    }

    set status(newValue) {
        this._status = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            restaurant_id: this.restaurant_id,
            delivery_adress: this.delivery_adress,
            order_cost: this.order_cost,
            list_dish_order: this.list_dish_order,
            status: this.status,
        };
    }
}

export default Order;
