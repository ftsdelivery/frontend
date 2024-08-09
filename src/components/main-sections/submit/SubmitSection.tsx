'use client'

import { orderService } from '@/services/orders.service'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast, ToastContainer } from 'react-toastify'
import styles from './SubmitSection.module.css'

export default function SubmitSectionComponent() {
	const [marketPlace, setMarketPlace] = useState('')
	const [warehouses, setWarehouses] = useState<string[]>([])
	const [promoCodeVisible, setPromoCodeVisible] = useState(false)
	const [captchaValue, setCaptchaValue] = useState<string | null>(null)

	const mutation = useMutation({
		mutationFn: (data: any) => orderService.createOrder(data),
		onSuccess: () => {
			toast.success('Заявка успешно отправлена!')
		},
		onError: () => {
			toast.error('Произошла ошибка при отправке заявки')
		},
	})

	useEffect(() => {
		// Обновляем доступные склады при изменении маркетплейса
		const warehouseOptions: { [key: string]: string[] } = {
			ЯндексМаркет: ['Склад 1', 'Склад 3', 'Склад 5'],
			Озон: ['Склад 2', 'Склад 4', 'Склад 6'],
			ВайлдБерриз: ['Склад 1', 'Склад 2', 'Склад 6'],
		}

		setWarehouses(marketPlace ? warehouseOptions[marketPlace] : [])
	}, [marketPlace])

	const handleCaptchaChange = (value: string | null) => {
		setCaptchaValue(value)
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!captchaValue) {
			toast.error('Пожалуйста, подтвердите, что вы не робот.')
			return
		}

		const formData = {
			ip: (event.target as any).ip.value,
			marketPlace: (event.target as any).marketPlace.value,
			warehouse: (event.target as any).warehouse.value,
			deliveryType: (event.target as any).deliveryType.value,
			quantity: (event.target as any).quantity.value,
			extraServices: (event.target as any).extraServices.value,
			pickupDate: (event.target as any).pickupDate.value,
			pickupTime: (event.target as any).pickupTime.value,
			pickupAddress: (event.target as any).pickupAddress.value,
			contactInfo: (event.target as any).contactInfo.value,
			comment: (event.target as any).comment.value || 'Без комментария',
			promoCode: promoCodeVisible
				? (event.target as any).promoCode.value
				: 'Без промокода',
			orderPrice: 10000,
		}

		// Отправка данных на сервер
		mutation.mutate(formData)
	}

	return (
		<section id='submit' className={`container py-5 ${styles.container}`}>
			<h2 className='fw-bold mb-4 text-center'>
				<i className='bi bi-pencil-square text-primary me-2'></i> Подать заявку
			</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-3'>
					<label htmlFor='ip' className='form-label'>
						ИП:
					</label>
					<input
						type='text'
						className='form-control'
						id='ip'
						placeholder='Введите ваш ИП'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='marketplace' className='form-label'>
						Маркетплейс:
					</label>
					<select
						className='form-select'
						id='marketPlace'
						value={marketPlace}
						onChange={e => setMarketPlace(e.target.value)}
						required
					>
						<option value=''>Выберите маркетплейс</option>
						<option value='ЯндексМаркет'>ЯндексМаркет</option>
						<option value='Озон'>Озон</option>
						<option value='ВайлдБерриз'>ВайлдБерриз</option>
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='warehouse' className='form-label'>
						Склад:
					</label>
					<select className='form-select' id='warehouse' required>
						<option value=''>Сначала выберите маркетплейс</option>
						{warehouses.map((warehouse, index) => (
							<option key={index} value={warehouse}>
								{warehouse}
							</option>
						))}
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='deliveryType' className='form-label'>
						Тип доставки:
					</label>
					<select className='form-select' id='deliveryType' required>
						<option value='Паллеты'>Палеты</option>
						<option value='Коробки'>Коробки</option>
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='quantity' className='form-label'>
						Количество:
					</label>
					<input
						type='number'
						className='form-control'
						id='quantity'
						placeholder='Введите количество'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='extraServices' className='form-label'>
						Доп. услуги:
					</label>
					<select className='form-select' id='extraServices' required>
						<option value='Без доп. услуг'>Без доп. услуг</option>
						<option value='Паллет'>Палет</option>
						<option value='Паллетирование'>Палетирование</option>
						<option value='Всё вместе'>Всё вместе</option>
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='pickupDate' className='form-label'>
						Дата забора:
					</label>
					<input
						type='date'
						className='form-control'
						id='pickupDate'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='pickupTime' className='form-label'>
						Время забора:
					</label>
					<select className='form-select' id='pickupTime' required>
						<option value='12-13'>с 12:00 до 13:00</option>
						<option value='13-14'>с 13:00 до 14:00</option>
						<option value='14-15'>с 14:00 до 15:00</option>
						<option value='15-16'>с 15:00 до 16:00</option>
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='pickupAddress' className='form-label'>
						Адрес забора:
					</label>
					<input
						type='text'
						className='form-control'
						id='pickupAddress'
						placeholder='Введите адрес забора'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='contactInfo' className='form-label'>
						Контакты:
					</label>
					<input
						type='text'
						className='form-control'
						id='contactInfo'
						placeholder='Введите контактные данные'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='comment' className='form-label'>
						Комментарий:
					</label>
					<textarea
						className='form-control'
						id='comment'
						rows={3}
						placeholder='Введите ваш комментарий'
					></textarea>
				</div>
				<div className='mb-3 form-check'>
					<input
						type='checkbox'
						className='form-check-input'
						id='promoCodeCheck'
						onChange={e => setPromoCodeVisible(e.target.checked)}
					/>
					<label className='form-check-label' htmlFor='promoCodeCheck'>
						Есть промокод?
					</label>
				</div>
				{promoCodeVisible && (
					<div className='mb-3'>
						<label htmlFor='promoCode' className='form-label'>
							Введите промокод:
						</label>
						<input
							type='text'
							className='form-control'
							id='promoCode'
							placeholder='Промокод'
						/>
					</div>
				)}

				{/* Добавление reCAPTCHA */}
				<div className='mb-3 d-flex justify-content-center'>
					<ReCAPTCHA
						sitekey='6LdtdSMqAAAAAE-zfag47XtfUT6d-Sr5bzMm9tM7'
						onChange={handleCaptchaChange}
					/>
				</div>

				<div className='d-flex justify-content-center'>
					<button type='submit' className='btn btn-primary mt-4'>
						Отправить заявку
					</button>
				</div>
			</form>
			<ToastContainer autoClose={2000} />
		</section>
	)
}
