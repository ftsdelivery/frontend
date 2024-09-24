import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id, 10)

		const query = `SELECT * FROM warehouses WHERE id = $1`
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Warehouse not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ data: rows[0] }, { status: 200 })
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
		const id = parseInt(params.id, 10)
		const body = await request.json()

		const query = `UPDATE warehouses SET name = $1, description = $2 WHERE id = $3 RETURNING *`
		const values = [body.name, body.description, id]
		const { rows } = await pool.query(query, values)

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Warehouse not found' },
				{ status: 404 }
			)
		}

		await createLog({
			action_type: 'UPDATE',
			target_id: id,
			target_name: 'WAREHOUSE',
			new_value: rows[0],
		})

		return NextResponse.json({ data: rows[0] }, { status: 200 })
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
		const id = parseInt(params.id, 10)

		const query = `DELETE FROM warehouses WHERE id = $1 RETURNING *`
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'Warehouse not found' },
				{ status: 404 }
			)
		}

		await createLog({
			action_type: 'DELETE',
			target_id: id,
			target_name: 'WAREHOUSE',
			old_value: rows[0],
		})

		return NextResponse.json({ data: rows[0] }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
