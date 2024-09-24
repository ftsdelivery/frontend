export interface PromoCode {
	id: number
	author_id?: number
	code?: string
	discount?: number
	count_of_uses?: number
	limit_of_uses?: number
	is_active?: boolean
}
