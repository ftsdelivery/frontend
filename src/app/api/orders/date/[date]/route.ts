// api/orders/date/[date]/route.ts

import pool from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { date: string } }
) {
	try {
		const date = params.date

		const query = 'SELECT * FROM orders WHERE pickup_date = $1'
		const { rows } = await pool.query(query, [date])

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'No orders found for this date' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ orders: rows })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
