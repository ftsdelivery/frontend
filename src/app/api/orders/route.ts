import { createLog } from '@/services/log.service'
import { createMessage } from '@/services/telegram.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(req: any) {
	try {
		const { searchParams } = new URL(req.url)

		let whereConditions: string[] = []
		let queryParams: any[] = []

		const filterableFields = {
			id: 'number',
			status: 'enum',
			author_id: 'number',
			ip: 'string',
			marketplace: 'string',
			warehouse: 'string',
			delivery_type: 'string',
			quantity: 'number',
			box_weight: 'number',
			box_size: 'string',
			extra_services: 'string',
			pickup_date: 'string',
			pickup_time: 'string',
			pickup_address: 'string',
			contacts: 'string',
			comment: 'string',
			promocode: 'string',
			price: 'number',
		}

		Object.entries(filterableFields).forEach(([field, type]) => {
			const value = searchParams.get(field)
			if (value) {
				if (type === 'string') {
					whereConditions.push(`${field} ILIKE $${queryParams.length + 1}`)
					queryParams.push(`%${value}%`)
				} else if (type === 'number') {
					whereConditions.push(`${field} = $${queryParams.length + 1}`)
					queryParams.push(parseFloat(value))
				} else if (type === 'enum') {
					whereConditions.push(`${field} = $${queryParams.length + 1}`)
					queryParams.push(value.toUpperCase())
				}
			}
		})

		let query = 'SELECT * FROM orders'

		if (whereConditions.length > 0) {
			query += ' WHERE ' + whereConditions.join(' AND ')
		}

		const limit = parseInt(searchParams.get('_limit') || '10', 10)
		const page = parseInt(searchParams.get('_page') || '1', 10)
		if (limit > 0) {
			const offset = (page - 1) * limit
			query += ` LIMIT $${queryParams.length + 1} OFFSET $${
				queryParams.length + 2
			}`
			queryParams.push(limit, offset)
		}

		const { rows } = await pool.query(query, queryParams)

		let totalQuery = 'SELECT COUNT(*) FROM orders'
		if (whereConditions.length > 0) {
			totalQuery += ' WHERE ' + whereConditions.join(' AND ')
		}

		const totalResult = await pool.query(
			totalQuery,
			queryParams.slice(0, whereConditions.length)
		)
		const total = parseInt(totalResult.rows[0].count, 10)

		return NextResponse.json({
			data: rows,
			total,
			pageInfo: {
				hasNextPage:
					limit > 0 ? (page - 1) * limit + rows.length < total : false,
				hasPreviousPage: limit > 0 ? page > 1 : false,
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

		const requiredFields = [
			'ip',
			'marketplace',
			'warehouse',
			'delivery_type',
			'quantity',
			'pickup_date',
			'pickup_time',
			'pickup_address',
			'contacts',
			'price',
		]

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
        author_id, ip, marketplace, warehouse, delivery_type, quantity,
        box_size, box_weight, extra_services, pickup_date, pickup_time, pickup_address,
        contacts, comment, promocode, price, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, now(), now()
      ) RETURNING *;
    `

		const insertParams = [
			body.author_id || 0,
			body.ip,
			body.marketplace,
			body.warehouse,
			body.delivery_type,
			body.quantity,
			body.box_size,
			body.box_weight,
			body.extra_services || 'Без доп. услуг',
			body.pickup_date,
			body.pickup_time,
			body.pickup_address,
			body.contacts,
			body.comment || 'Без комментария',
			body.promocode || 'Без промокода',
			body.price,
		]

		const { rows } = await pool.query(insertQuery, insertParams)

		await createMessage({
			author_id: body.author_id || 0,
			ip: body.ip,
			marketplace: body.marketplace,
			warehouse: body.warehouse,
			delivery_type: body.delivery_type,
			quantity: body.quantity,
			box_size: body.box_size,
			box_weight: body.box_weight,
			extra_services: body.extra_services || 'Без доп. услуг',
			pickup_date: body.pickup_date,
			pickup_time: body.pickup_time,
			pickup_address: body.pickup_address,
			contacts: body.contacts,
			comment: body.comment || 'Без комментария',
			promocode: body.promocode || 'Без промокода>',
			price: body.price,
		})

		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'ORDER',
			new_value: rows[0],
		})

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
