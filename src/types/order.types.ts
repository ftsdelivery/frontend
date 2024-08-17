export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	DELIVERED = 'DELIVERED',
	CANCELED = 'CANCELED',
}

export interface Order {
	id?: number
	user_id?: any
	ip?: string
	marketPlace?: string
	warehouse?: string
	delivery_type?: string
	quantity?: number
	extra_services?: string
	pickup_date?: string
	pickup_time?: string
	pickup_address?: string
	contact_info?: string
	comment?: string
	promo_code?: string
	order_price?: number
}
