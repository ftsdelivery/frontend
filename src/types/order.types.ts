export enum Status {
	PENDING,
	CONFIRMED,
	DELIVERED,
	CANCELED,
	OVERDUE,
}

export interface Order {
	id?: number | 0
	created_at?: string
	updated_at?: string
	author_id?: number
	status?: Status
	ip?: string
	marketplace?: string
	warehouse?: string
	delivery_type?: string
	quantity?: number
	box_size?: string
	box_weight?: number
	extra_services?: string
	pickup_date?: string
	pickup_time?: string
	pickup_address?: string
	contacts?: string
	comment?: string
	promocode?: string
	price?: number
}
