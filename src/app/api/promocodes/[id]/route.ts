import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id

		const query = 'SELECT * FROM promo_codes WHERE id = $1'
		const { rows } = await pool.query(query, [id])

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'PromoCode not found' },
				{ status: 404 }
			)
		}

		const totalQuery = 'SELECT COUNT(*) FROM promo_codes'
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
			'code',
			'discount',
			'is_active',
			'count_of_uses',
			'limit_of_uses',
		]

		// 1. Получаем старые данные
		const oldDataQuery = `
            SELECT ${allowedFields.join(', ')}
            FROM promo_codes
            WHERE id = $1;
        `
		const { rows: oldRows } = await pool.query(oldDataQuery, [id])

		if (oldRows.length === 0) {
			return NextResponse.json(
				{ error: 'PromoCode not found' },
				{ status: 404 }
			)
		}

		const oldData = oldRows[0]

		// 2. Подготовка для обновления только измененных полей
		const setClauses: string[] = []
		const updateParams: any[] = []
		let paramIndex = 1

		// Создаем объекты для хранения старых и новых значений
		const oldValue: any = {}
		const newValue: any = {}

		for (const field of allowedFields) {
			// Сравниваем, было ли значение изменено
			if (body[field] !== undefined && body[field] !== oldData[field]) {
				setClauses.push(`${field} = $${paramIndex}`)
				updateParams.push(body[field])
				paramIndex++

				// Записываем старое и новое значения для лога
				oldValue[field] = oldData[field]
				newValue[field] = body[field]
			}
		}

		// Если нет изменений, возвращаем ошибку
		if (setClauses.length === 0) {
			return NextResponse.json(
				{ error: 'No valid fields to update or no changes detected' },
				{ status: 400 }
			)
		}

		// 3. Выполняем обновление
		const updateQuery = `
            UPDATE promo_codes
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `
		updateParams.push(id)

		const { rows } = await pool.query(updateQuery, updateParams)

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'PromoCode not found' },
				{ status: 404 }
			)
		}

		// 4. Запись лога с изменениями
		await createLog({
			action_type: 'UPDATE',
			target_id: rows[0].id,
			target_name: 'PROMO',
			old_value: oldValue, // Старые значения измененных полей
			new_value: newValue, // Новые значения
		})

		return NextResponse.json({
			message: 'PromoCode updated',
		})
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
			'DELETE FROM promo_codes WHERE id = $1 RETURNING *',
			[id]
		)

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'PromoCode not found' },
				{ status: 404 }
			)
		}

		// Запись лога с удаленной записью
		await createLog({
			action_type: 'DELETE',
			target_id: rows[0].id,
			target_name: 'PROMO',
			old_value: rows[0],
		})

		return NextResponse.json({ message: 'PromoCode deleted' })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
