// api/orders/[id]/route.ts

import pool from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id

		const query = 'SELECT * FROM orders WHERE id = $1'
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		const totalQuery = 'SELECT COUNT(*) FROM orders'
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

		const allowedFields = [
			'ip',
			'user_id',
			'market_place',
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
