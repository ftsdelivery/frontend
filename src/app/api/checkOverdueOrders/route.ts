import pool from '@/lib/db'
import checkForOverdueOrders from '@/utils/checkForOverdueOrders'
import { NextResponse } from 'next/server'

export async function GET(req: any) {
	try {
		// Вызов функции для проверки и обновления статусов заказов
		await checkForOverdueOrders(pool)

		// Возвращаем успешный ответ
		return NextResponse.json({
			success: true,
			message: 'Orders checked and updated if overdue.',
		})
	} catch (error) {
		console.error('Error checking for overdue orders:', error)

		// Возвращаем ответ с ошибкой
		return NextResponse.json(
			{ success: false, message: 'Error checking for overdue orders.' },
			{ status: 500 }
		)
	}
}
