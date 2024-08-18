import { Order } from '@/types/order.types'

export const getAllOrders = async () => {
	const response = await fetch(`/api/orders`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
	})
	if (!response.ok) throw new Error('Unable to fetch orders.')
	return response.json()
}

export const getOrdersByDate = async (date: string) => {
	const response = await fetch(`/api/orders/date/${date}`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
	})
	if (!response.ok) throw new Error('Unable to fetch orders.')
	return response.json()
}

export const getOrderById = async (id: number) => {
	const response = await fetch(`/api/orders/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
	})
	console.log(response)
	return response.json()
}

export const getOrderByUserId = async (userId: number) => {
	const response = await fetch(`/api/orders`)
	if (!response.ok) throw new Error('Unable to fetch orders.')
	const orders = await response.json()
	return orders
}

export const createOrder = async (order: Order) => {
	const response = await fetch(`/api/orders`, {
		method: 'POST',
		body: JSON.stringify(order),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	if (!response.ok) throw new Error('Unable to create order.')
	return response.json()
}

export const updateOrder = async (id: number, order: Order) => {
	const response = await fetch(`/api/orders/${id}`, {
		method: 'PUT',
		body: JSON.stringify(order),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	if (!response.ok) throw new Error('Unable to update order.')
	return response.json()
}

export const deleteOrder = async (id: number) => {
	const response = await fetch(`/api/orders/${id}`, {
		method: 'DELETE',
	})
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
		const response = await fetch(`/api/orders/date/${date}`)

		// Если сервер вернул 404, значит на эту дату нет заказов
		if (response.status === 404) {
			return filterPastTimeSlots(date, timeSlots)
		}

		if (!response.ok) {
			throw new Error('Unable to fetch orders.')
		}

		// Получаем объект с массивом заказов
		const data = await response.json()
		const orders = data.orders || []

		// Фильтруем занятые временные интервалы и те, что уже прошли
		const availableTimeSlots = timeSlots.filter(
			timeSlot =>
				!orders.some((order: Order) => order.pickup_time === timeSlot) &&
				!isPastTimeSlot(date, timeSlot)
		)

		return availableTimeSlots
	} catch (error) {
		console.error(error)
		// В случае любой ошибки возвращаем пустой массив
		return []
	}
}

// Функция для фильтрации временных интервалов, которые уже прошли
const isPastTimeSlot = (date: string, timeSlot: string) => {
	const [startHour] = timeSlot.split('-')[0].split(':').map(Number)
	const currentDate = new Date()
	const slotDate = new Date(date)

	// Устанавливаем время на основе временного интервала
	slotDate.setHours(startHour, 0, 0, 0)

	// Проверяем, если текущая дата и время позже, чем временной интервал
	return currentDate > slotDate
}

// Функция для фильтрации всех временных интервалов на текущую дату
const filterPastTimeSlots = (date: string, timeSlots: string[]) => {
	return timeSlots.filter(timeSlot => !isPastTimeSlot(date, timeSlot))
}
