import pool from '@/lib/db'
import { NextResponse } from 'next/server'

interface Params {
	user_id: number
}

export async function GET(request: Request, { params }: { params: Params }) {
	try {
		const userId = params.user_id
		console.log(userId)
		const { rows } = await pool.query(
			'SELECT * FROM orders WHERE user_id = $1',
			[userId]
		)
		return NextResponse.json(rows)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
}
