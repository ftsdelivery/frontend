export interface User {
	name?: string
	email: string
	password: string
	contacts?: string
	role?: string
	used_promo_codes?: string[]
	orders_count?: number
}
