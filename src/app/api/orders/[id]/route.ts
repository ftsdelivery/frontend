// api/orders/[id]/route.ts

import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
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
			return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
		}

		return NextResponse.json({
			data: rows[0],
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
			'author_id',
			'marketplace',
			'warehouse',
			'delivery_type',
			'quantity',
			'extra_services',
			'pickup_date',
			'pickup_time',
			'pickup_address',
			'contacts',
			'comment',
			'promocode',
			'price',
			'status',
		]

		const oldDataQuery = `
            SELECT ${allowedFields.join(', ')}
            FROM orders
            WHERE id = $1;
        `
		const { rows: oldRows } = await pool.query(oldDataQuery, [id])

		if (oldRows.length === 0) {
			return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
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
            UPDATE orders
            SET ${setClauses.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `
		updateParams.push(id)

		const { rows } = await pool.query(updateQuery, updateParams)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
		}

		// 4. Запись лога с изменениями
		createLog({
			action_type: 'UPDATE',
			target_id: rows[0].id,
			target_name: 'ORDER',
			old_value: oldValue, // Старые значения измененных полей
			new_value: newValue, // Новые значения
		})

		return NextResponse.json({
			message: 'Информация о заявке обновлена',
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
			'DELETE FROM orders WHERE id = $1 RETURNING *',
			[id]
		)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
		}
		createLog({
			action_type: 'DELETE',
			target_id: rows[0].id,
			target_name: 'ORDER',
			old_value: rows[0],
		})
		return NextResponse.json({ message: 'Заявка удалена' })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
