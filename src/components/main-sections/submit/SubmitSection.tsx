'use client'

import { checkAvailableTimeSlots, createOrder } from '@/services/order.service'
import { getUserIdByEmail } from '@/services/user.service'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast, ToastContainer } from 'react-toastify'
import styles from './SubmitSection.module.css'

export default function SubmitSectionComponent() {
	const [marketPlace, setMarketPlace] = useState('')
	const [warehouses, setWarehouses] = useState<string[]>([])
	const [promoCodeVisible, setPromoCodeVisible] = useState(false)
	const [captchaValue, setCaptchaValue] = useState<string | null>(null)
	const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [minDate, setMinDate] = useState('')
	const [session, setSession] = useState<Session | null>(null)
	const [userId, setUserId] = useState<number | null>(null)
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		const fetchData = async () => {
			// Fetch and set session
			if (!session) {
				const sessionData = await getSession()
				setSession(sessionData)
			}

			// Fetch userId if session is available
			if (session?.user?.email && userId === null) {
				try {
					const userID = await getUserIdByEmail(session.user.email)
					setUserId(userID)
				} catch (error) {
					console.log('User not found, setting userId to null')
					setUserId(null)
				}
			}

			// Set minDate
			const today = new Date()
			const formattedDate = today.toISOString().split('T')[0]
			setMinDate(formattedDate)

			// Set warehouse options
			const warehouseOptions: { [key: string]: string[] } = {
				ЯндексМаркет: ['Склад 1', 'Склад 3', 'Склад 5'],
				Озон: ['Склад 2', 'Склад 4', 'Склад 6'],
				ВайлдБерриз: ['Склад 1', 'Склад 2', 'Склад 6'],
			}
			setWarehouses(marketPlace ? warehouseOptions[marketPlace] : [])

			// Fetch available time slots if selectedDate is set
			if (selectedDate) {
				try {
					const slots = await checkAvailableTimeSlots(selectedDate)
					setAvailableTimeSlots(slots)
				} catch (error) {
					console.error(error)
				}
			}
		}

		fetchData()
	}, [session, userId, marketPlace, selectedDate])

	const handleCaptchaChange = (value: string | null) => {
		setCaptchaValue(value)
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// if (!captchaValue) {
		// 	toast.error('Пожалуйста, подтвердите, что вы не робот.')
		// 	return
		// }
		if (userId === null) {
			console.log('UserId is still null')
		}

		try {
			createOrder({
				ip: (event.target as any).ip.value,
				marketPlace: (event.target as any).marketPlace.value,
				warehouse: (event.target as any).warehouse.value,
				delivery_type: (event.target as any).deliveryType.value,
				quantity: (event.target as any).quantity.value,
				extra_services: (event.target as any).extraServices.value,
				pickup_date: (event.target as any).pickupDate.value,
				pickup_time: (event.target as any).pickupTime.value,
				pickup_address: (event.target as any).pickupAddress.value,
				contact_info: (event.target as any).contactInfo.value,
				comment: (event.target as any).comment.value || 'Без комментария',
				promo_code: promoCodeVisible
					? (event.target as any).promoCode.value
					: 'Без промокода',
				order_price: 10000,
				user_id: userId,
			}).then(() => {
				toast.success('Заявка успешно отправлена')
				if (formRef.current) {
					formRef.current.reset()
				}
				setMarketPlace('')
				setWarehouses([])
				setPromoCodeVisible(false)
				setCaptchaValue(null)
			})
		} catch (error) {
			toast.error('Произошла ошибка при отправке заявки')
		}
	}

	return (
		<section id='submit' className={`container py-5 ${styles.container}`}>
			<h2 className='fw-bold mb-4 text-center'>
				<i className='bi bi-pencil-square text-primary me-2'></i> Подать заявку
			</h2>
			<form onSubmit={handleSubmit} ref={formRef}>
				<div className='mb-3'>
					<label htmlFor='ip' className='form-label'>
						ИП:
					</label>
					<input
						type='text'
						className={`form-control ${styles.Input}`}
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
						className={`form-select ${styles.Select}`}
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
					<select
						className={`form-select ${styles.Select}`}
						id='warehouse'
						required
					>
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
					<select
						className={`form-select ${styles.Select}`}
						id='deliveryType'
						required
					>
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
						className={`form-control ${styles.Input}`}
						id='quantity'
						placeholder='Введите количество'
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='extraServices' className='form-label'>
						Доп. услуги:
					</label>
					<select
						className={`form-select ${styles.Select}`}
						id='extraServices'
						required
					>
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
						className={`form-control ${styles.Input}`}
						id='pickupDate'
						value={selectedDate}
						onChange={e => setSelectedDate(e.target.value)}
						min={minDate}
						required
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='pickupTime' className='form-label'>
						Время забора:
					</label>
					<select
						className={`form-select ${styles.Select}`}
						id='pickupTime'
						required
					>
						{availableTimeSlots.length > 0 ? (
							availableTimeSlots.map((slot, index) => (
								<option key={index} value={slot}>
									{slot}
								</option>
							))
						) : (
							<option>Нет доступных временных интервалов</option>
						)}
					</select>
				</div>
				<div className='mb-3'>
					<label htmlFor='pickupAddress' className='form-label'>
						Адрес забора:
					</label>
					<input
						type='text'
						className={`form-control ${styles.Input}`}
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
						className={`form-control ${styles.Input}`}
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
						className={`form-control ${styles.Input}`}
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
							className={`form-control ${styles.Input}`}
							id='promoCode'
							placeholder='Промокод'
						/>
					</div>
				)}

				{/* Добавление reCAPTCHA */}
				<div className='mb-3 d-flex justify-content-center'>
					<ReCAPTCHA
						sitekey='6LdwTSgqAAAAAGcFOlepu3B3O-wBVtd8h27IQo_h'
						onChange={handleCaptchaChange}
					/>
				</div>

				<div className='d-flex justify-content-center'>
					<button type='submit' className='btn btn-primary mt-4'>
						Отправить заявку
					</button>
				</div>
			</form>
			<ToastContainer autoClose={1500} />
		</section>
	)
}
