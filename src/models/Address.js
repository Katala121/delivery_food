class Address {
    constructor(id, user_id, address_name, address) {
        this._id = id;
        this._user_id = user_id;
        this._address_name = address_name;
        this._address = address;
    }

    get id() {
        return this._id;
    }

    get user_id() {
        return this._user_id;
    }

    get address_name() {
        return this._address_name;
    }

    set address_name(newValue) {
        this._address_name = newValue;
    }

    get address() {
        return this._address;
    }

    set address(newValue) {
        this._address = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this._user_id,
            address_name: this._address_name,
            address: this._address,
        };
    }
}

export default Address;
