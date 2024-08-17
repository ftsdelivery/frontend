import pool from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id

		const query = 'SELECT * FROM users WHERE id = $1'
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const totalQuery = 'SELECT COUNT(*) FROM users'
		const totalResult = await pool.query(totalQuery)
		const total = parseInt(totalResult.rows[0].count, 10)

		return NextResponse.json({
			data: rows[0],
			total,
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

		const allowedFields = ['email', 'name', 'role']
		const fields = Object.keys(body).filter(key => allowedFields.includes(key))
		const values = fields.map(key => body[key])

		const query = `UPDATE users SET ${fields
			.map((field, index) => `${field} = $${index + 2}`)
			.join(', ')} WHERE id = $1`
		await pool.query(query, [id, ...values])

		return NextResponse.json({ message: 'User updated' })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
