import { axiosClassic, axiosWithAuth } from '@/api/interceptors'
import { IOrderResponse, TypeOrderFormState } from '@/types/orders.types'

class OrderService {
	private BASE_URL = '/orders'

	async getOrders() {
		const response = await axiosWithAuth.get<IOrderResponse[]>(this.BASE_URL)
		return response
	}

	async createOrder(data: TypeOrderFormState) {
		const response = await axiosClassic.post(this.BASE_URL, data)
		return response
	}

	async updateOrder(id: string, data: TypeOrderFormState) {
		const response = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)
		return response
	}

	async deleteOrder(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
		return response
	}
}

export const orderService = new OrderService()
