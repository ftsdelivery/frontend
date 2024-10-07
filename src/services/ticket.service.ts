import { Ticket } from '@/types/ticket.types'

export const getTickets = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch warehouses.')
	}

	return response.json()
}

export const getTicketById = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets/${id}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch tickets.')
	}

	return response.json()
}

export const getTicketsCount = async (): Promise<number> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets?status=PENDING`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)

	if (!response.ok) throw new Error('Unable to fetch orders.')

	const data = await response.json()

	return data.total
}

export const addTicket = async (ticket: Ticket): Promise<Ticket> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets`,
		{
			method: 'POST',
			body: JSON.stringify(ticket),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		throw new Error('Unable to add ticket.')
	}

	return response.json()
}

export const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets/${ticket.id}`,
		{
			method: 'PUT',
			body: JSON.stringify(ticket),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		throw new Error('Unable to update ticket.')
	}

	return response.json()
}

export const removeTicket = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets/${id}`,
		{
			method: 'DELETE',
		}
	)

	if (!response.ok) {
		throw new Error('Unable to remove ticket.')
	}

	return response.json()
}
