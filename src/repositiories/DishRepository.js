// import Dish from '../Models/Dish.js';

class DishRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async create() {
        return 'created dish';
    }

    async findById() {
        return 'dish';
    }

    async findByRestaurantId() {
        return 'dish';
    }

    async get() {
        return 'get dish';
    }

    async update() {
        return 'updated dish';
    }

    async delete() {
        return 'deleted dish';
    }
}

export default DishRepository;
