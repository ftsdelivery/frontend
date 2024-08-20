import type { User } from '@/types/user.types'

export const getUser = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`
	)
	if (!response.ok) throw new Error('Unable to fetch user.')
	return response.json()
}

export const getUserByEmail = async (email: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/email/${email}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch user.')
	}

	return response.json()
}

export const getUserIdByEmail = async (email: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/email/${email}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch user.')
	}

	const user = await response.json()

	if (user) {
		return user.id
	}

	return 0 // Если пользователь не найден, возвращаем null
}

export const getUserOrders = async (id: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/orders/${id}`
	)
	if (!response.ok) throw new Error('Unable to fetch user orders.')
	return response.json()
}

export const getUsers = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch users.')
	return response.json()
}

export const createUser = async (user: User) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
		{
			method: 'POST',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
	if (!response.ok) {
		if (response.status === 409) {
			throw new Error('User already exists')
		}
		throw new Error('Unable to create user.')
	}
	return response.json()
}

export const updateUser = async (id: number, user: User) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
		{
			method: 'PUT',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
	if (!response.ok) throw new Error('Unable to update user.')
	return response.json()
}

export const deleteUser = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
		{
			method: 'DELETE',
		}
	)
	if (!response.ok) throw new Error('Unable to delete user.')
	return response.json()
}
