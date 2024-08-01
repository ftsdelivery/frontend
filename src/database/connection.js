// src/database/connection.js
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qwerty1596321',
  database: 'ftpdelivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool