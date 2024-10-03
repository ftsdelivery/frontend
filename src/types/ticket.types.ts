export enum Status {
	PENDING,
	ANSWERED,
}

export interface Ticket {
	id?: number
	user_id?: number
	user_name?: string
	email?: string
	question?: string
	question_theme?: string
	admin_reply?: string
	admin_id?: number
	status?: Status
}
