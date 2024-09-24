import { Order } from '@/types/order.types'

export const createMessage = async (order: Order) => {
	const botToken = '7116659961:AAFx-bPH6gWi22AKkbR5m4RsgyzeTi2dMQ0'
	const chatId = '-4212299903'

	const message = `
	<b>🆕 Новая заявка:</b>\n
	<b>🏢 ИП:</b> ${order.ip}
	<b>🛒 Маркетплейс:</b> ${order.marketplace}
	<b>🏠 Склад:</b> ${order.warehouse}
	<b>🚚 Тип доставки:</b> ${order.delivery_type}
	<b>🔢 Количество:</b> ${order.quantity}
	<b>📦 Размер короба:</b> ${order.box_size}
	<b>⚖️ Вес короба:</b> ${order.box_weight}
	<b>🛠️ Доп. услуги:</b> ${order.extra_services}
	<b>📅 Дата забора:</b> ${order.pickup_date}
	<b>⏰ Время забора:</b> ${order.pickup_time}
	<b>📍 Адрес забора:</b> ${order.pickup_address}
	<b>📞 Контакты:</b> ${order.contacts}
	<b>💬 Комментарий:</b> ${order.comment}
	<b>🎟️ Промокод:</b> ${order.promocode}\n
	<b>💵 Предварительная стоимость:</b> ${order.price} руб.
	<b>🆔 ID Автора:</b> ${order.author_id}
`

	const url = `https://api.telegram.org/bot${botToken}/sendMessage`

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: 'HTML',
			}),
		})

		if (!response.ok) {
			const error = await response.json()
			console.error('Ошибка Telegram API:', error)
		} else {
			console.log('Сообщение успешно отправлено в Telegram')
		}
	} catch (error) {
		console.error('Ошибка отправки сообщения в Telegram:', error)
	}
}
