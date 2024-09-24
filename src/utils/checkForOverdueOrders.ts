import { Pool } from 'pg'

// Функция для проверки и обновления статусов просроченных заказов
async function checkForOverdueOrders(pool: Pool) {
	const client = await pool.connect()

	try {
		// Получение текущей даты в формате yyyy-mm-dd
		const today = new Date().toISOString().split('T')[0]

		// Запрос для обновления статусов просроченных заказов
		const result = await client.query(
			`
      UPDATE orders
      SET status = 'OVERDUE'
      WHERE pickup_date < $1
        AND status NOT IN ('DELIVERED', 'CANCELED')
    `,
			[today]
		)
	} catch (err) {
		console.error('Error updating overdue orders:', err)
	} finally {
		client.release()
	}
}

export default checkForOverdueOrders
