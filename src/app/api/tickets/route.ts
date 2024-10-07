import { createLog } from '@/services/log.service'
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
			user_id: 'number',
			email: 'string',
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

		let query = 'SELECT * FROM tickets'

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

		let totalQuery = 'SELECT COUNT(*) FROM tickets'
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

		const query = `INSERT INTO tickets (user_id, user_name, email, question, question_theme) VALUES ($1, $2, $3, $4, $5) RETURNING *`
		const values = [
			body.user_id,
			body.user_name,
			body.email,
			body.question,
			body.question_theme,
		]
		const { rows } = await pool.query(query, values)

		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'TICKET',
			new_value: rows[0],
		})

		return NextResponse.json({ data: rows[0] }, { status: 201 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
