class Review {
    constructor(id, restaurant_id, review) {
        this._id = id;
        this._restaurant_id = restaurant_id;
        this._review = review;
    }

    get id() {
        return this._id;
    }

    get restaurant_id() {
        return this._restaurant_id;
    }

    get review() {
        return this._review;
    }

    set review(newValue) {
        this._review = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            restaurant_id: this.restaurant_id,
            review: this.review,
        };
    }
}

export default Review;
