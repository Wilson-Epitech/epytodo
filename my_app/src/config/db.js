const mariadb = require('mariadb');
require('dotenv').config({ path: '../.env' });

const pool = mariadb.createPool({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

module.exports = Object.freeze({
    pool: pool
});
