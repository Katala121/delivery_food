class Dish {
    constructor(id, description, price, category, photo_link, restaurant_id) {
        this._id = id;
        this._description = description;
        this._price = price;
        this._category = category;
        this._photo_link = photo_link;
        this._restaurant_id = restaurant_id;
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

    get price() {
        return this._price;
    }

    set price(newValue) {
        this._price = newValue;
    }

    get category() {
        return this._category;
    }

    set category(newValue) {
        this._category = newValue;
    }

    get photo_link() {
        return this._photo_link;
    }

    set photo_link(newValue) {
        this._photo_link = newValue;
    }

    get restaurant_id() {
        return this._restaurant_id;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
            price: this.price,
            category: this.category,
            photo_link: this.photo_link,
            restaurant_id: this.restaurant_id,
        };
    }
}

export default Dish;
