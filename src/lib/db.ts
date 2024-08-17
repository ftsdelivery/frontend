import { Pool } from 'pg'

// Создайте пул подключений
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'ftsdelivery',
	password: '1596321',
	port: 5432,
})

export default pool
