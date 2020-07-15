class User {
    constructor({
        id, name, surname, email, photo_link,
    }) {
        this._id = id;
        this._name = name;
        this._surname = surname;
        this._email = email;
        this._photo_link = photo_link;
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

    get surname() {
        return this._surname;
    }

    set surname(newValue) {
        this._surname = newValue;
    }

    get email() {
        return this._email;
    }

    set email(newValue) {
        this._email = newValue;
    }

    get photo_link() {
        return this._photo_link;
    }

    set photo_link(newValue) {
        this._photo_link = newValue;
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
            surname: this.surname,
            email: this.email,
            photo_link: this.photo_link,
            token: this.token,
        };
    }
}

export default User;
