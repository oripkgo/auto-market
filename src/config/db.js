// db.js
require('dotenv').config(); // .env 파일 로드

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,          // .env에서 읽어옴
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
