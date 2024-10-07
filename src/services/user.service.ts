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
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?_email=${email}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch user.')
	}
	const data = await response.json()
	return data.data[0]
}

export const getUserIdByEmail = async (email: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?_email=${email}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch user.')
	}

	const user = await response.json()

	if (user) {
		return user.data[0].id
	}

	return 0
}

export const getUserIdByResetToken = async (token: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?_token=${token}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch user by token.')
	}

	const user = await response.json()

	if (user) {
		return user.data[0].id
	}

	return null
}

export const getUserOrders = async (id: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`
	)
	console.log(response)
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

export const sendResetPasswordEmail = async (email: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/reset-password`,
		{
			method: 'POST',
			body: JSON.stringify({ email }),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
	if (!response.ok) throw new Error('Unable to send reset password email.')
	return response.json()
}

export const updateUserPassword = async (id: number, newPassword: string) => {
	const user = { password: newPassword } // Создаем объект пользователя с новым паролем
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

	if (!response.ok) throw new Error('Unable to update user password.')
	return response.json() // Возвращаем ответ от сервера
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

export const getUsersCountForPeriod = async (startDate: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?startDate=${startDate}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch users count.')
	const data = await response.json()
	return data.total
}

export const getUsersCountByDay = async () => {
	const today = new Date().toISOString().split('T')[0]
	return getUsersCountForPeriod(today)
}

export const getUsersCountByWeek = async () => {
	const today = new Date()
	const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
	return getUsersCountForPeriod(startOfWeek.toISOString().split('T')[0])
}

export const getUsersCountByMonth = async () => {
	const today = new Date()
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
	return getUsersCountForPeriod(startOfMonth.toISOString().split('T')[0])
}
