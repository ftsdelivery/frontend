export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	DELIVERED = 'DELIVERED',
	CANCELED = 'CANCELED',
}

export interface IOrderResponse {
	id: string
	status?: OrderStatus
	createdAt?: string
	updatedAt?: string
	ip?: string
	marketPlace?: string
	warehouse?: string
	deliveryType?: string
}

export type TypeOrderFormState = Partial<
	Omit<IOrderResponse, 'id' | 'updatedAt'>
>
