import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const ids =
			searchParams
				.get('id')
				?.split(',')
				.map(id => parseInt(id, 10)) || []

		const email = searchParams.get('_email') || ''

		const sortField = searchParams.get('_sort') || 'id'
		const sortOrder = searchParams.get('_order') === 'DESC' ? 'DESC' : 'ASC'
		const limit = parseInt(searchParams.get('_limit') || '10', 10)
		const page = parseInt(searchParams.get('_page') || '1', 10)
		const offset = (page - 1) * limit

		let query = `
					SELECT * FROM users
			`
		let queryParams: any[] = []

		if (ids.length > 0) {
			query += ` WHERE id = ANY($1::int[])`
			queryParams.push(ids)
		} else if (email) {
			query += ` WHERE email = $1`
			queryParams.push(email)
		}

		query += ` ORDER BY ${sortField} ${sortOrder}`
		if (limit > 0) {
			query += ` LIMIT $${queryParams.length + 1} OFFSET $${
				queryParams.length + 2
			}`
			queryParams.push(limit, offset)
		}

		const { rows } = await pool.query(query, queryParams)

		let total = rows.length
		if (ids.length === 0 && !email) {
			const totalQuery = 'SELECT COUNT(*) FROM users'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 }
			)
		}

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
				{ error: 'Пользователь с такой почтой уже существует' },
				{ status: 409 }
			)
		}

		const { rows } = await pool.query(
			`INSERT INTO users (email, password)VALUES ($1, $2) RETURNING *`,
			[email, password]
		)
		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'USER',
			new_value: rows[0],
		})
		return NextResponse.json(rows[0], { status: 201 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при создании пользователя' },
			{ status: 500 }
		)
	}
}
