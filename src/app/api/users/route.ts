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
		let query = `SELECT * FROM users`
		let queryParams: any[] = []

		// Если указан параметр id, добавляем условие WHERE
		if (ids.length > 0) {
			query += ` WHERE id = ANY($1::int[])`
			queryParams.push(ids)
		}

		// Обработка сортировки
		const sortField = searchParams.get('_sort')
		const sortUser = searchParams.get('_user') === 'DESC' ? 'DESC' : 'ASC'
		if (sortField) {
			query += ` ORDER BY ${sortField} ${sortUser}`
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
			const totalQuery = 'SELECT COUNT(*) FROM users'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		// Если заказов нет, возвращаем ошибку
		if (rows.length === 0) {
			return NextResponse.json({ error: 'No users found' }, { status: 404 })
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
		const { email, password } = await request.json()
		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		const existingUser = await pool.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		)
		if (existingUser.rows.length > 0) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 409 } // Conflict
			)
		}

		const { rows } = await pool.query(
			`INSERT INTO users (email, password)VALUES ($1, $2) RETURNING *`,
			[email, password]
		)

		return NextResponse.json(rows[0], { status: 201 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при создании пользователя' },
			{ status: 500 }
		)
	}
}
