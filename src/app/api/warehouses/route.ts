import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const marketplaceId = searchParams.get('marketplace_id') // изменено с 'id' на 'marketplaceId'

		let query = `SELECT * FROM warehouses`
		let queryParams: any[] = []
		let conditions: string[] = []

		if (marketplaceId) {
			conditions.push(`marketplace_id = $${queryParams.length + 1}`) // изменено с 'marketplaceId' на 'marketplace_id'
			queryParams.push(marketplaceId)
		}

		if (conditions.length > 0) {
			query += ` WHERE ` + conditions.join(' AND ')
		}

		const sortField = searchParams.get('_sort')
		const sortOrder = searchParams.get('_order') === 'DESC' ? 'DESC' : 'ASC'
		if (sortField) {
			query += ` ORDER BY ${sortField} ${sortOrder}`
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
		if (marketplaceId === null) {
			const totalQuery = 'SELECT COUNT(*) FROM warehouses'
			const totalResult = await pool.query(totalQuery)
			total = parseInt(totalResult.rows[0].count, 10)
		}

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: 'No Warehouses found' },
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

export async function POST(request: Request) {
	try {
		const body = await request.json()

		const query = `INSERT INTO warehouses (name, description, marketplace_id) VALUES ($1, $2, $3) RETURNING *`
		const values = [body.name, body.description, body.marketplace_id]
		const { rows } = await pool.query(query, values)

		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'WAREHOUSE',
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
