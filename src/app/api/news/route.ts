import { createLog } from '@/services/log.service'
import pool from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const newsId = searchParams.get('news_item')

		let query = `SELECT * FROM news`
		let queryParams: any[] = []

		if (newsId) {
			query += ` WHERE id = $1`
			queryParams.push(newsId)
		}

		const { rows } = await pool.query(query, queryParams)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'No News found' }, { status: 404 })
		}

		return NextResponse.json({
			data: rows,
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
		const { title, content, image } = body

		const query = `INSERT INTO news (title, content, image) VALUES ($1, $2, $3) RETURNING *`
		const values = [title, content, image]
		const { rows } = await pool.query(query, values)

		await createLog({
			action_type: 'CREATE',
			target_id: rows[0].id,
			target_name: 'NEWS',
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

// PUT News
export async function PUT(request: Request) {
	try {
		const body = await request.json()
		const { id, title, content, image } = body

		const query = `UPDATE news SET title = $1, content = $2, image = $3, updated_at = NOW() WHERE id = $4 RETURNING *`
		const values = [title, content, image, id]
		const { rows } = await pool.query(query, values)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'News not found' }, { status: 404 })
		}

		await createLog({
			action_type: 'UPDATE',
			target_id: id,
			target_name: 'NEWS',
			new_value: rows[0],
		})

		return NextResponse.json({ data: rows[0] })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}

// DELETE News
export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		const query = `DELETE FROM news WHERE id = $1 RETURNING *`
		const values = [id]
		const { rows } = await pool.query(query, values)

		if (rows.length === 0) {
			return NextResponse.json({ error: 'News not found' }, { status: 404 })
		}

		await createLog({
			action_type: 'DELETE',
			target_id: Number(id),
			target_name: 'NEWS',
			old_value: rows[0],
		})

		return NextResponse.json({ data: rows[0] }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
