export interface IAuthForm {
	email: string
	password: string
}

export interface IUser {
	id: string
	name?: string
	email: string

	role: string
	used_promo_codes: string[]
	orders_count: number
	orders?: Orders[]
}

export interface Orders {
	id: string
	status: string
	createdAt: string
	updatedAt: string
	ip: string
	marketPlace: string
	warehouse: string
	deliveryType: string
	quantity: number
	extraServices: string
	pickupDate: string
	pickupTime: string
	pickupAddress: string
	contactInfo: string
	comment: string
	promoCode: string
	orderPrice: number
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
