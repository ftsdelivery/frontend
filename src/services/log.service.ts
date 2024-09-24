import { authConfig } from '@/config/auth'
import { Log } from '@/types/log.types'
import { getServerSession } from 'next-auth'

export const getAllLogs = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging?_limit=1000`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch logs.')
	return response.json()
}

export const getLogsByDate = async (date: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging/date/${date}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch logs.')
	return response.json()
}

export const getLogById = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging/${id}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	return response.json()
}

export const getLogsByUserId = async (userId: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging`
	)
	if (!response.ok) throw new Error('Unable to fetch logs.')
	const logs = await response.json()
	return logs
}

export const getLogsByTargetId = async (actionId: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging?target_id=${actionId}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch logs.')
	return response.json()
}

export const createLog = async (log: Log) => {
	// Получаем сессию и author_id
	const session = await getServerSession(authConfig)
	const author_id = session?.user?.id

	// Добавляем author_id в тело лога
	const logWithAuthor = {
		...log,
		author_id, // Используем author_id из сессии
	}

	// Отправляем запрос на создание лога
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/logging`,
		{
			method: 'POST',
			body: JSON.stringify(logWithAuthor),
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) throw new Error('Unable to create log.')

	return response.json()
}

export const getAllLogsWithPages = async (
	page: number = 1,
	filters: Partial<Log> = {},
	itemsPerPage: number = 10
): Promise<any> => {
	try {
		const queryParams = new URLSearchParams({
			_page: page.toString(),
			_limit: itemsPerPage.toString(),
		})

		Object.keys(filters).forEach(key => {
			const value = filters[key as keyof Log]
			if (value !== undefined && value !== '') {
				queryParams.append(key, value.toString())
			}
		})

		const response = await fetch(`/api/logging?${queryParams.toString()}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return await response.json()
	} catch (error) {
		console.error('Error fetching logs:', error)
		throw error
	}
}
