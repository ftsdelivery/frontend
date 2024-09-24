import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(req: any) {
	try {
		const { searchParams } = new URL(req.url)
		const ids =
			searchParams
				.get('id')
				?.split(',')
				.map(id => parseInt(id, 10)) || []

		const code = searchParams.get('code')

		let query = `SELECT * FROM promo_codes`
		let queryParams: any[] = []
		let conditions: string[] = []

		if (ids.length > 0) {
			conditions.push(`id = ANY($${queryParams.length + 1}::int[])`)
			queryParams.push(ids)
		}

		if (code) {
			// Используем точное совпадение, а не LIKE
			conditions.push(`code = $${queryParams.length + 1}`)
			queryParams.push(code)
		}

		if (conditions.length > 0) {
			query += ` WHERE ` + conditions.join(' AND ')
		}

		const sortField = searchParams.get('_sort')
		const sortPromo =
			searchParams.get('_promo_code') === 'DESC' ? 'DESC' : 'ASC'
		if (sortField) {
			query += ` ORDER BY ${sortField} ${sortPromo}`
		}

		const limit = parseInt(searchParams.get('_limit') || '0', 10)
		const page = parseInt(searchParams.get('_page') || '1', 10)
		if (limit > 0) {
			const offset = (page - 1) * limit
			query += ` LIMIT $${queryParams.length + 1} OFFSET $${
				queryParams.length + 2
			}`
			queryParams.push(limit, offset)
		}

		const { rows } = await pool.query(query, queryParams)

		let total = rows.length
		if (ids.length === 0 && !code) {
			const totalQuery = 'SELECT COUNT(*) FROM promo_codes'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'No PromoCodes found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			data: rows,
			total,
			pageInfo: {
				hasNextPage:
					limit > 0 ? (page - 1) * limit + rows.length < total : false,
				hasPreviousPage: limit > 0 ? page - 1 > 0 : false,
			},
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

export async function POST(req: any) {
	try {
		const body = await req.json()

		const query = `INSERT INTO promo_codes (code, author_id, discount, is_active, count_of_uses, limit_of_uses) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
		const values = [
			body.code,
			body.author_id || 0,
			body.discount,
			body.is_active,
			body.count_of_uses,
			body.limit_of_uses,
		]
		const { rows } = await pool.query(query, values)
		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'PROMO',
			new_value: rows[0],
		})
		return NextResponse.json({ data: rows[0] }, { status: 201 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
