export const getWarehouses = async (marketplaceId: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/warehouses?marketplace_id=${marketplaceId}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch warehouses.')
	}

	return response.json()
}

export const addWarehouse = async (
	name: string,
	description: string,
	marketplace_id: number
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/warehouses`,
		{
			method: 'POST',
			body: JSON.stringify({ name, description, marketplace_id }),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		throw new Error('Unable to add warehouse.')
	}

	return response.json()
}

export const updateWarehouse = async (
	id: number,
	name: string,
	description: string,
	marketplaceId: number
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/warehouses/${id}`,
		{
			method: 'PUT',
			body: JSON.stringify({ name, description, marketplaceId }),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) {
		throw new Error('Unable to update warehouse.')
	}

	return response.json()
}

export const removeWarehouse = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/warehouses/${id}`,
		{
			method: 'DELETE',
		}
	)

	if (!response.ok) {
		throw new Error('Unable to delete warehouse.')
	}

	return response.json()
}
