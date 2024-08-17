import type { PromoCode } from '@/types/promo_code.types'

export const getPromoCode = async (code: any) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/promo_codes/${code}`
	)

	if (!response.ok) {
		throw new Error('Unable to fetch promo code.')
	}

	return response.json()
}

export const getPromoCodes = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/promocodes`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	)
	if (!response.ok) throw new Error('Unable to fetch promo codes.')
	return response.json()
}

export const createPromoCode = async (promoCode: PromoCode) => {
	const response = await fetch('/api/promo_codes', {
		method: 'POST',
		body: JSON.stringify(promoCode),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	if (!response.ok) throw new Error('Unable to create promo code.')
	return response.json()
}

export const updatePromoCode = async (id: number, promoCode: PromoCode) => {
	const response = await fetch(`/api/promo_codes/${id}`, {
		method: 'PUT',
		body: JSON.stringify(promoCode),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	if (!response.ok) throw new Error('Unable to update promo code.')
	return response.json()
}

export const deletePromoCode = async (id: number) => {
	const response = await fetch(`/api/promo_codes/${id}`, {
		method: 'DELETE',
	})
	if (!response.ok) throw new Error('Unable to delete promo code.')
}
