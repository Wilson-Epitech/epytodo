const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'yanisH78',
    database: 'epytodo',
});

module.exports = Object.freeze({
    pool: pool
});
