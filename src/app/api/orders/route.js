import pool from '../../../database/connection'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  try {
    let query = 'SELECT * FROM orders'
    let params = []

    if (id) {
      query += ' WHERE id = ?'
      params.push(id)
    }

    const [rows] = await pool.query(query, params)
    return new Response(JSON.stringify({ users: rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function POST(request) {
  const body = await request.json()
  try {
    const [result] = await pool.query('INSERT INTO orders SET ?', body)
    return new Response(JSON.stringify({ status: true, message: 'Ордер был успешно создан' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function PUT(request) {
  const body = await request.json()

  try {
    await pool.query('UPDATE orders SET ? WHERE id = ?', [body, body.id])
    return new Response(JSON.stringify({ status: true, message: 'Ордер был успешно изменён' }), {
      status: 204,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function DELETE(request) {
  const body = await request.json()

  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [body.id])
    return new Response(JSON.stringify({ status: true, message: 'Ордер был успешно удалён' }), {
      status: 204,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}