import pool from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: any) {
	try {
		// Получение параметров из запроса
		const { searchParams } = new URL(req.url)
		const ids =
			searchParams
				.get('id')
				?.split(',')
				.map(id => parseInt(id, 10)) || []

		// Базовый запрос
		let query = `SELECT * FROM orders`
		let queryParams: any[] = []

		// Если указан параметр id, добавляем условие WHERE
		if (ids.length > 0) {
			query += ` WHERE id = ANY($1::int[])`
			queryParams.push(ids)
		}

		// Обработка сортировки
		const sortField = searchParams.get('_sort')
		const sortOrder = searchParams.get('_order') === 'DESC' ? 'DESC' : 'ASC'
		if (sortField) {
			query += ` ORDER BY ${sortField} ${sortOrder}`
		}

		// Обработка пагинации
		const limit = parseInt(searchParams.get('_limit') || '0', 10)
		const page = parseInt(searchParams.get('_page') || '1', 10)
		if (limit > 0) {
			const offset = (page - 1) * limit
			query += ` LIMIT $${queryParams.length + 1} OFFSET $${
				queryParams.length + 2
			}`
			queryParams.push(limit, offset)
		}

		// Выполнение запроса к базе данных
		const { rows } = await pool.query(query, queryParams)

		// Запрос общего количества заказов для правильной пагинации
		let total = rows.length
		if (ids.length === 0) {
			const totalQuery = 'SELECT COUNT(*) FROM orders'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		// Если заказов нет, возвращаем ошибку
		if (rows.length === 0) {
			return NextResponse.json({ error: 'No orders found' }, { status: 404 })
		}

		// Возвращаем заказы с информацией о пагинации (если применимо)
		return NextResponse.json({
			data: rows,
			total,
			pageInfo: {
				hasNextPage:
					limit > 0 ? (page - 1) * limit + rows.length < total : false,
				hasPreviousPage: limit > 0 ? page - 1 > 0 : false,
			},
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()

		// Поля, которые необходимо вставить
		const requiredFields = [
			'ip',
			'marketPlace',
			'warehouse',
			'delivery_type',
			'quantity',
			'pickup_date',
			'pickup_time',
			'pickup_address',
			'contact_info',
			'order_price',
		]

		// Проверяем наличие всех обязательных полей
		for (const field of requiredFields) {
			if (!body[field]) {
				return NextResponse.json(
					{ error: `Field ${field} is required` },
					{ status: 400 }
				)
			}
		}

		const insertQuery = `
            INSERT INTO orders (
                ip, user_id, "marketPlace", warehouse, delivery_type, quantity,
                extra_services, pickup_date, pickup_time, pickup_address,
                contact_info, comment, promo_code, order_price
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10,
                $11, $12, $13, $14
            ) RETURNING *;
        `

		const insertParams = [
			body.ip,
			body.user_id || null, // Поле, которое может быть необязательным
			body.marketPlace,
			body.warehouse,
			body.delivery_type,
			body.quantity,
			body.extra_services || 'Без доп. услуг', // Поля, которые могут быть необязательными
			body.pickup_date,
			body.pickup_time,
			body.pickup_address,
			body.contact_info,
			body.comment || 'Без комментария',
			body.promo_code || 'Без промокода',
			body.order_price,
		]

		const { rows } = await pool.query(insertQuery, insertParams)

		// Возвращаем созданный заказ
		return NextResponse.json(
			{ message: 'Заявка успешно создана' },
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

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id
		const body = await request.json()

		const allowedFields = [
			'ip',
			'user_id',
			'marketPlace',
			'warehouse',
			'delivery_type',
			'quantity',
			'extra_services',
			'pickup_date',
			'pickup_time',
			'pickup_address',
			'contact_info',
			'comment',
			'promo_code',
			'order_price',
			'status',
		]

		const setClauses: string[] = []
		const updateParams: any[] = []
		let paramIndex = 1

		for (const field of allowedFields) {
			if (body[field] !== undefined) {
				setClauses.push(`${field} = $${paramIndex}`)
				updateParams.push(body[field])
				paramIndex++
			}
		}

		if (setClauses.length === 0) {
			return NextResponse.json(
				{ error: 'No valid fields to update' },
				{ status: 400 }
			)
		}

		const updateQuery = `
            UPDATE orders
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `

		updateParams.push(id)

		const { rows } = await pool.query(updateQuery, updateParams)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		return NextResponse.json({ orders: rows[0] })
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

		const { rows } = await pool.query(
			'DELETE FROM orders WHERE id = $1 RETURNING *',
			[id]
		)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		return NextResponse.json({ status: true, message: 'Order deleted' })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
