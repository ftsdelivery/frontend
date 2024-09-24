import { Order } from '@/types/order.types'

const formatDate = (date: Date) => date.toISOString().split('T')[0]

export const getAllOrders = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?_limit=1000`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch orders.')
	return response.json()
}

export const getOrdersByDate = async (date: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/date/${date}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch orders.')
	return response.json()
}

export const getOrderById = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	return response.json()
}

export const getOrderByUserId = async (userId: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`)
	if (!response.ok) throw new Error('Unable to fetch orders.')
	const orders = await response.json()
	return orders
}

export const createOrder = async (order: Order) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
		{
			method: 'POST',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
	if (!response.ok) throw new Error('Unable to create order.')
	return response.json()
}

export const updateOrder = async (id: number, order: Order) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`,
		{
			method: 'PUT',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
	if (!response.ok) throw new Error('Unable to update order.')
	return response.json()
}

export const deleteOrder = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`,
		{
			method: 'DELETE',
		}
	)
	if (!response.ok) throw new Error('Unable to delete order.')
	return response.json()
}

export const checkAvailableTimeSlots = async (date: string) => {
	const timeSlots = [
		'10:00-12:00',
		'12:00-14:00',
		'14:00-16:00',
		'16:00-18:00',
		'18:00-20:00',
	]

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?pickup_date=${date}`
		)
		if (response.status === 404) {
			return filterPastTimeSlots(date, timeSlots)
		}

		if (!response.ok) {
			throw new Error('Unable to fetch orders.')
		}

		const data = await response.json()
		const orders = data.data || []

		const availableTimeSlots = timeSlots.filter(
			timeSlot =>
				!orders.some((order: Order) => order.pickup_time === timeSlot) &&
				!isPastTimeSlot(date, timeSlot)
		)

		return availableTimeSlots
	} catch (error) {
		console.error(error)
		return []
	}
}

const isPastTimeSlot = (date: string, timeSlot: string) => {
	const [startTime, endTime] = timeSlot.split('-')
	const [startHour, startMinute] = startTime.split(':').map(Number)
	const [endHour, endMinute] = endTime.split(':').map(Number)

	const currentDate = new Date()
	const slotDate = new Date(date)

	slotDate.setHours(startHour, startMinute, 0, 0)
	const startDateTime = slotDate.getTime()

	slotDate.setHours(endHour, endMinute, 0, 0)
	const endDateTime = slotDate.getTime()

	return currentDate.getTime() > endDateTime
}

const filterPastTimeSlots = (date: string, timeSlots: string[]) => {
	return timeSlots.filter(timeSlot => !isPastTimeSlot(date, timeSlot))
}

export const getPendingOrdersCount = async (): Promise<number> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?status=PENDING`,
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

export const getAllOrdersWithPages = async (
	page: number = 1,
	filters: Partial<Order> = {},
	itemsPerPage: number = 10
): Promise<any> => {
	try {
		const queryParams = new URLSearchParams({
			_page: page.toString(),
			_limit: itemsPerPage.toString(),
		})

		Object.keys(filters).forEach(key => {
			const value = filters[key as keyof Order]
			if (value !== undefined && value !== '') {
				queryParams.append(key, value.toString())
			}
		})

		const response = await fetch(`/api/orders?${queryParams.toString()}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return await response.json()
	} catch (error) {
		console.error('Error fetching orders:', error)
		throw error
	}
}

export const getOrdersCountForPeriod = async (startDate: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?startDate=${startDate}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch orders count.')
	const data = await response.json()
	return data.total
}

export const getOrdersCountByDay = async () => {
	const today = formatDate(new Date())
	return getOrdersCountForPeriod(today)
}

export const getOrdersCountByWeek = async () => {
	const today = new Date()
	const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
	return getOrdersCountForPeriod(formatDate(startOfWeek))
}

export const getOrdersCountByMonth = async () => {
	const today = new Date()
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
	return getOrdersCountForPeriod(formatDate(startOfMonth))
}
