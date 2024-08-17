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
		let query = `SELECT * FROM promo_codes`
		let queryParams: any[] = []

		// Если указан параметр id, добавляем условие WHERE
		if (ids.length > 0) {
			query += ` WHERE id = ANY($1::int[])`
			queryParams.push(ids)
		}

		// Обработка сортировки
		const sortField = searchParams.get('_sort')
		const sortOrder = searchParams.get('_promocode') === 'DESC' ? 'DESC' : 'ASC'
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
			const totalQuery = 'SELECT COUNT(*) FROM promo_codes'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		// Если заказов нет, возвращаем ошибку
		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'No promo_codes found' },
				{ status: 404 }
			)
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
		const { code, discount, author_id, count_of_uses, limit_of_uses } =
			await request.json()
		if (!code || !discount) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		const existingPromoCode = await pool.query(
			'SELECT * FROM promo_codes WHERE code = $1',
			[code]
		)
		if (existingPromoCode.rows.length > 0) {
			return NextResponse.json(
				{ error: 'Promo code already exists' },
				{ status: 409 } // Conflict
			)
		}
		const is_active = true
		const { rows } = await pool.query(
			`INSERT INTO promo_codes (code, discount, author_id, count_of_uses, limit_of_uses, is_active)VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			[code, discount, author_id, count_of_uses, limit_of_uses, is_active]
		)

		return NextResponse.json(rows[0], { status: 201 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при создании промокода' },
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

		const allowedFields = ['discount', 'is_active', 'limit_of_uses']

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
            UPDATE promo_codes
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `

		updateParams.push(id)

		const { rows } = await pool.query(updateQuery, updateParams)

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'PromoCode not found' },
				{ status: 404 }
			)
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
		const { rows } = await pool.query(
			`DELETE FROM promo_codes WHERE id = $1 RETURNING *`,
			[params.id]
		)

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Promo code not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(rows[0])
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при удалении промокода' },
			{ status: 500 }
		)
	}
}
