class Basket {
    constructor(id, user_id) {
        this._id = id;
        this._user_id = user_id;
    }

    get id() {
        return this._id;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(newValue) {
        this._user_id = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
        };
    }
}

export default Basket;
