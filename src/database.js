import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: process.env.DB_HOST,
    database: 'delivery_food',
    password: 'postgres',
    port: process.env.DB_PORT,
});

export default pool;