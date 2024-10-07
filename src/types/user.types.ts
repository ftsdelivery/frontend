export interface User {
	id?: number
	created_at?: string
	updated_at?: string
	name?: string
	email?: string
	password?: string
	admin_password?: string
	role?: string
	used_promocodes?: string[] | string
	orders_count?: number
	reset_token?: string | null
}
