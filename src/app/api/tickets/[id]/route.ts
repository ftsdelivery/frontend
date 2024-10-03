import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id, 10)

		const query = `SELECT * FROM tickets WHERE id = $1`
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
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

		const query = `UPDATE tickets SET admin_reply = $1, admin_id = $2, status = $3 WHERE id = $4 RETURNING *`
		const values = [body.admin_reply, body.admin_id, body.status, id]
		const { rows } = await pool.query(query, values)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Tickets not found' }, { status: 404 })
		}

		await createLog({
			action_type: 'UPDATE',
			target_id: id,
			target_name: 'TICKET',
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

		const query = `DELETE FROM tickets WHERE id = $1 RETURNING *`
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
		}

		await createLog({
			action_type: 'DELETE',
			target_id: id,
			target_name: 'TICKET',
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
