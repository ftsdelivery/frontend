import { DataProvider, fetchUtils } from 'react-admin'

const BASE_URL = 'http://localhost:3000'

export const dataProvider: DataProvider = {
	getList: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}`

		const options = {
			headers: new Headers({
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}

		const response = await fetchUtils.fetchJson(url, options)

		return {
			data: response.json.data,
			total: response.json.data.total,
		}
	},
	getOne: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}/${params.id}`
		const options = {
			headers: new Headers({
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
	getMany: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}?id=${params.ids.join(',')}`
		const options = {
			headers: new Headers({
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json }
	},
	getManyReference: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}?${params.target}=${params.id}`
		const options = {
			headers: new Headers({
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return {
			data: response.json.data,
			total: response.json.data.total,
		}
	},
	create: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}`
		const options = {
			method: 'POST',
			body: JSON.stringify(params.data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
	update: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}/${params.id}`
		const options = {
			method: 'PUT',
			body: JSON.stringify(params.data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
	updateMany: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}`
		const options = {
			method: 'PUT',
			body: JSON.stringify(params.data),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
	delete: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}/${params.id}`
		const options = {
			method: 'DELETE',
			headers: new Headers({
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
	deleteMany: async (resource: string, params: any) => {
		const url = `${BASE_URL}/api/${resource}`
		const options = {
			method: 'DELETE',
			body: JSON.stringify(params.ids),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.API_KEY}`,
			}),
		}
		const response = await fetchUtils.fetchJson(url, options)

		return { data: response.json.data }
	},
}
