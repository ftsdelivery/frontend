import pool from '@/lib/db'
import { NextResponse } from 'next/server'

interface Params {
	email: string
}

export async function GET(request: Request, { params }: { params: Params }) {
	try {
		const UserEmail = params.email
		console.log(UserEmail)

		// Выбираем id, email, role и password пользователя
		const { rows } = await pool.query(
			'SELECT id, email, role, password FROM users WHERE email = $1',
			[UserEmail]
		)

		// Если пользователь найден, возвращаем его данные
		if (rows.length > 0) {
			return NextResponse.json({
				id: rows[0].id,
				email: rows[0].email,
				role: rows[0].role,
				password: rows[0].password,
			})
		} else {
			// Если пользователь не найден, возвращаем null или другую ошибку
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
