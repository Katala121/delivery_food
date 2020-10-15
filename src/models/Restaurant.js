class Restaurant {
    constructor({ id, name, description }) {
        this._id = id;
        this._name = name;
        this._description = description;
    }

    get id() {
        return this._id;
    }

    get description() {
        return this._description;
    }

    set description(newValue) {
        this._description = newValue;
    }

    get name() {
        return this._name;
    }

    set name(newValue) {
        this._name = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
        };
    }
}

export default Restaurant;
