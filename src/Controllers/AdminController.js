// import bcrypt           from 'bcryptjs';
// import jwt              from 'jsonwebtoken';
import OrderRepository  from '../Repositiories/OrderRepository.js';
import AdminRepository  from '../Repositiories/AdminRepository.js';
import RestaurantRepository  from '../Repositiories/RestaurantRepository.js';

class AdminController {
    constructor() {
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.updateRestaurant = this.updateRestaurant.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);

        this.adminRepository = new AdminRepository();
        this.orderRepository = new OrderRepository();
        this.restaurantRepository = new RestaurantRepository();
    }

    async registration(request, response) {
        const admin = await this.adminRepository.create();

        response.send(admin);
    }

    async login(request, response) {
        const admin = await this.adminRepository.findByRestarantId();

        response.send(admin);
    }

    async getRestaurant(request, response) {
        const restaurant = await this.restaurantRepository.get();

        response.send(restaurant);
    }

    async updateRestaurant(request, response) {
        const restaurant = await this.restaurantRepository.update();

        response.send(restaurant);
    }

    async deleteRestaurant(request, response) {
        const restaurant = await this.restaurantRepository.delete();

        response.send(restaurant);
    }

    async getOrder(request, response) {
        const order = await this.orderRepository.get();

        response.send(order);
    }

    async updateOrder(request, response) {
        const order = await this.orderRepository.update();

        response.send(order);
    }

    async deleteOrder(request, response) {
        const order = await this.orderRepository.delete();

        response.send(order);
    }
}

export default AdminController;
