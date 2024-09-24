export interface Log {
	id?: number
	created_at?: string
	author_id?: number
	action_type?: string
	target_id?: number
	target_name?: string
	old_value?: string
	new_value?: string
}
