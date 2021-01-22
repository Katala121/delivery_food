class Review {
    constructor({
        id, restaurant_id, review, rating,
    }) {
        this._id = id;
        this._restaurant_id = restaurant_id;
        this._review = review;
        this._rating = rating;
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

    get rating() {
        return this._rating;
    }

    set rating(newValue) {
        this._rating = newValue;
    }

    toJSON() {
        return {
            id: this.id,
            restaurant_id: this.restaurant_id,
            review: this.review,
            rating: this.rating,
        };
    }
}

export default Review;
