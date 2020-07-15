class Admin {
    constructor(id, name, restaurant) {
        this._id = id;
        this._name = name;
        this._restaurant = restaurant;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(newValue) {
        this._name = newValue;
    }

    get restaurant() {
        return this._restaurant;
    }

    set restaurant(newValue) {
        this._restaurant = newValue;
    }

    get password() {
        return this._password;
    }

    set password(newValue) {
        this._password = newValue;
    }

    get token() {
        return this._token;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            restaurant: this.restaurant,
            token: this.token,
        };
    }
}

export default Admin;
