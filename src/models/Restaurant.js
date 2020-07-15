class Restaurant {
    constructor(id, description) {
        this._id = id;
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

    toJSON() {
        return {
            id: this.id,
            description: this.description,
        };
    }
}

export default Restaurant;
