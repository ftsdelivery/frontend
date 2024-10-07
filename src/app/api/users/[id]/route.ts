import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id

		const query = `
      SELECT 
        u.id AS user_id, u.created_at AS user_created_at, u.updated_at AS user_updated_at,
        u.email, u.name, u.role, u.password, u.admin_password, u.used_promocodes, u.orders_count, u.reset_token,
        o.id AS order_id, o.status AS order_status, o.created_at AS order_created_at,
        o.updated_at AS order_updated_at, o.ip, o.marketplace, o.warehouse, o.delivery_type,
        o.quantity, o.extra_services, o.pickup_date, o.pickup_time, o.pickup_address,
        o.contacts, o.comment, o.promocode, o.price
      FROM users u
      LEFT JOIN orders o ON u.id = o.author_id
      WHERE u.id = $1
    `
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 }
			)
		}

		const usersMap: Record<number, any> = {}

		for (const row of rows) {
			const userId = row.user_id

			if (!usersMap[userId]) {
				usersMap[userId] = {
					id: userId,
					created_at: row.user_created_at,
					updated_at: row.user_updated_at,
					email: row.email,
					name: row.name,
					role: row.role,
					password: row.password,
					admin_password: row.admin_password,
					used_promocodes: row.used_promocodes,
					orders_count: row.orders_count,
					reset_token: row.reset_token,
					orders: {
						total: 0,
						data: [],
					},
				}
			}

			if (row.order_id) {
				usersMap[userId].orders.data.push({
					id: row.order_id,
					status: row.order_status,
					created_at: row.order_created_at,
					updated_at: row.order_updated_at,
					ip: row.ip,
					marketplace: row.marketplace,
					warehouse: row.warehouse,
					delivery_type: row.delivery_type,
					quantity: row.quantity,
					extra_services: row.extra_services,
					pickup_date: row.pickup_date,
					pickup_time: row.pickup_time,
					pickup_address: row.pickup_address,
					contacts: row.contacts,
					comment: row.comment,
					promocode: row.promocode,
					price: row.price,
				})
				usersMap[userId].orders.total++
			}
		}

		const userData = Object.values(usersMap)[0]

		return NextResponse.json({
			data: userData,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id
		const body = await request.json()

		// Проверяем, если 'used_promocodes' передается как строка, конвертируем её обратно в массив
		if (
			body.used_promocodes !== undefined &&
			typeof body.used_promocodes === 'string'
		) {
			try {
				body.used_promocodes = JSON.parse(body.used_promocodes)
			} catch (error) {
				console.error(
					"Invalid JSON format for 'used_promocodes':",
					body.used_promocodes
				)
				return NextResponse.json(
					{ error: 'Invalid format for used_promocodes' },
					{ status: 400 }
				)
			}
		}

		// Если пустой массив, то проверим, что это массив, а не строка
		if (
			body.used_promocodes !== undefined &&
			!Array.isArray(body.used_promocodes)
		) {
			body.used_promocodes = []
		}

		const allowedFields = [
			'email',
			'name',
			'role',
			'password',
			'used_promocodes',
			'orders_count',
			'admin_password',
			'reset_token',
		]

		// 1. Получаем старые данные ДО обновления
		const oldDataQuery = `
	SELECT ${allowedFields.join(', ')}
	FROM users
	WHERE id = $1;
`
		const { rows: oldRows } = await pool.query(oldDataQuery, [id])

		if (oldRows.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const oldData = oldRows[0]

		// 2. Подготовка для обновления только измененных полей
		const setClauses: string[] = []
		const updateParams: any[] = []
		let paramIndex = 1

		// Создаем объекты для хранения старых и новых значений
		const oldValue: any = {}
		const newValue: any = {}

		for (const field of allowedFields) {
			// Проверяем, было ли значение передано в теле запроса
			if (body[field] !== undefined) {
				// Проверяем, изменилось ли значение по сравнению с тем, что было в базе
				if (JSON.stringify(body[field]) !== JSON.stringify(oldData[field])) {
					setClauses.push(`${field} = $${paramIndex}`)
					updateParams.push(body[field])
					paramIndex++

					// Записываем старое и новое значения для лога
					oldValue[field] = oldData[field]
					newValue[field] = body[field]
				}
			}
		}

		// Если нет изменений, возвращаем ошибку
		if (setClauses.length === 0) {
			return NextResponse.json(
				{ error: 'No valid fields to update or no changes detected' },
				{ status: 400 }
			)
		}

		// 3. Выполняем обновление
		const updateQuery = `
	UPDATE users
	SET ${setClauses.join(', ')}
	WHERE id = $${paramIndex}
	RETURNING *;
`
		updateParams.push(id)

		const { rows } = await pool.query(updateQuery, updateParams)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// 4. Запись лога с изменениями
		await createLog({
			action_type: 'UPDATE',
			target_id: rows[0].id,
			target_name: 'USER',
			old_value: oldValue,
			new_value: newValue,
		})

		return NextResponse.json(
			{ message: 'Пользователь обновлён' },
			{ status: 200 }
		)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id

		const query = 'DELETE FROM users WHERE id = $1'
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		await createLog({
			action_type: 'DELETE',
			target_id: rows[0].id,
			target_name: 'USER',
			old_value: rows[0],
		})

		return NextResponse.json({ message: 'Пользователь удалён' })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
