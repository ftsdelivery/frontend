import pool from '@/lib/db'
import { NextResponse } from 'next/server'

interface Params {
	code: string
}

export async function GET(request: Request, { params }: { params: Params }) {
	try {
		const promoCode = params.code

		const { rows } = await pool.query(
			'SELECT * FROM promo_codes WHERE code = $1',
			[promoCode]
		)

		if (rows.length > 0) {
			return NextResponse.json(rows[0])
		} else {
			return NextResponse.json(null, { status: 200 })
		}
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
}
