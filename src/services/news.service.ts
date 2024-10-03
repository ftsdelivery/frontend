export const getAllNews = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`)

	if (!response.ok) {
		throw new Error('Unable to fetch news.')
	}

	return response.json()
}
export const getNewsById = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/news?news_item=${id}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch news.')
	}

	return response.json()
}

export const addNews = async (
	image: string,
	title: string,
	content: string
) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`, {
		method: 'POST',
		body: JSON.stringify({ image, title, content }),
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Unable to add news.')
	}

	return response.json()
}

export const updateNews = async (
	id: number,
	image: string,
	title: string,
	content: string
) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`, {
		method: 'PUT',
		body: JSON.stringify({ id, image, title, content }),
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Unable to update news.')
	}

	return response.json()
}

export const removeNews = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/news?id=${id}`,
		{
			method: 'DELETE',
		}
	)

	if (!response.ok) {
		throw new Error('Unable to remove news.')
	}

	return response.json()
}
