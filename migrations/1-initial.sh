#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
create table if not exists public."users"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name varchar(200) not null,
    surname varchar(200) DEFAULT null,
    email varchar(200) not null unique,
    photo_link varchar(500) DEFAULT null,
    password varchar(200) not null
);

ALTER TABLE public."users" OWNER TO postgres;

create table if not exists public."baskets"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id bigint not null REFERENCES users
);

ALTER TABLE public."baskets" OWNER TO postgres;

create table if not exists public."restaurants"
(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	name varchar(200) not null unique,
   	description text DEFAULT null,
	rating real
);

ALTER TABLE public."restaurants" OWNER TO postgres;

create table if not exists public."admins"
(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
   	name varchar(200) not null unique,
	password varchar(200) not null,
	restaurant_id int references restaurants
);

ALTER TABLE public."admins" OWNER TO postgres;

create table if not exists public."favourite_restaurants"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
   	user_id bigint not null references users,
	restaurant_id int not null references restaurants
);

ALTER TABLE public."favourite_restaurants" OWNER TO postgres;

create table if not exists public."categories"
(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
   	category varchar(200) not null
);

ALTER TABLE public."categories" OWNER TO postgres;

create table if not exists public."dishes"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	title varchar(500) not null,
	description text DEFAULT null,
	photo_link varchar(500) DEFAULT null,
	price money DEFAULT 0 ,
   	category_id int references categories,
	restaurant_id int references restaurants
);

ALTER TABLE public."dishes" OWNER TO postgres;

create table if not exists public."reviews"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	review text not null,
	restaurant_id int references restaurants,
	user_id bigint references users,
	rating smallint
);

ALTER TABLE public."reviews" OWNER TO postgres;

create table if not exists public."delivery_addresses"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	user_id bigint references users,
	address_name varchar(200) not null,
	address varchar(400) DEFAULT null
);

ALTER TABLE public."delivery_addresses" OWNER TO postgres;

create type order_status as enum('new', 'accepted', 'delivers', 'delivered', 'done', 'canceled');

create table if not exists public."orders"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	user_id bigint references users,
	delivery_address_id bigint DEFAULT null,
	order_cost money DEFAULT 0,
	restaurant_id int references restaurants not null,
	order_time timestamptz not null,
	status order_status DEFAULT 'new'
);

ALTER TABLE public."orders" OWNER TO postgres;

create table if not exists public."list_of_dishes_order"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	order_id bigint references orders not null,
	dish_id bigint references dishes not null,
	quantity smallint DEFAULT 1
);

ALTER TABLE public."list_of_dishes_order" OWNER TO postgres;

create table if not exists public."list_of_dishes_basket"
(
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	basket_id bigint references baskets not null,
	dish_id bigint references dishes not null
);

ALTER TABLE public."list_of_dishes_basket" OWNER TO postgres;
EOSQL