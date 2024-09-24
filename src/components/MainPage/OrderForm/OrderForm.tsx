'use client'

import { checkAvailableTimeSlots, createOrder } from '@/services/order.service'
import { getPromoCode, updatePromoCode } from '@/services/promocodes.service'
import { getUser, updateUser } from '@/services/user.service'
import { getWarehouses } from '@/services/warehouses.service'
import { Order, Status } from '@/types/order.types'
import { PromoCode } from '@/types/promocode.types'
import { User } from '@/types/user.types'
import { Warehouse } from '@/types/warehouse.types'
import { InputMask } from '@react-input/mask'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { toast } from 'sonner'
import styles from './OrderForm.module.css'

export default function SubmitSectionComponent() {
	interface CustomSession {
		expires: string
		user: {
			email: string
			id: number
			name: string | null
			role: string
			orders_count: number
		}
	}

	const { data: sessionData, status } = useSession()
	const session =
		status === 'authenticated'
			? (sessionData as unknown as CustomSession)
			: null
	const userID = session?.user?.id || 0
	const formRef = useRef<HTMLFormElement>(null)
	const [selectedRadio, setSelectedRadio] = useState<
		'Ozon' | 'Яндекс Маркет' | 'Wildberries'
	>('Ozon')
	const [selectedDeliveryType, setSelectedDeliveryType] = useState<
		'Паллеты' | 'Коробки'
	>('Паллеты')
	const [selectedWarehouse, setSelectedWarehouse] = useState<{
		id: number
		name: string
	} | null>(null)
	const [deliveryAddress, setDeliveryAddress] = useState<string>('')
	const [boxSize, setBoxSize] = useState<string>('Стандартный (60x40x40)')
	const [additionalServices, setAdditionalServices] = useState<string[]>([])
	const [boxWeight, setBoxWeight] = useState<number>(0)
	const [boxCount, setBoxCount] = useState<number>(0)
	const [timeInterval, setTimeInterval] = useState<string>(
		'Выберите время отправки'
	)
	const [PromoUsed, setPromoUsed] = useState<boolean>(false)
	const [minDate, setMinDate] = useState<string>('')
	const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
	const [selectedDate, setSelectedDate] = useState<string>('')

	const [showPromoCode, setShowPromoCode] = useState<boolean>(false)
	const [promoCode, setPromoCode] = useState<string>('')
	const [isPromoCodeValid, setIsPromoCodeValid] = useState<boolean | null>(null)
	const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false)
	const [promocodeData, setPromocodeData] = useState<{
		discount: number
	} | null>(null)

	const [contactInfo, setContactInfo] = useState<string>('')
	const [estimatedPrice, setEstimatedPrice] = useState<number>(0)

	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [warehousesOzon, setWarehousesOzon] = useState<Warehouse[]>([])
	const [warehousesYandex, setWarehousesYandex] = useState<Warehouse[]>([])
	const [warehousesWildberries, setWarehousesWildberries] = useState<
		Warehouse[]
	>([])
	const [loading, setLoading] = useState<boolean>(false)

	const PALLET_PRICE = 2000
	const BOXES_PER_GROUP = 16
	const ADDITIONAL_SERVICES_COST: { [key: string]: number } = {
		Паллет: 200,
		Паллетирование: 350,
		Погрузка: 200,
	}

	useEffect(() => {
		const today = new Date()
		setMinDate(today.toISOString().split('T')[0])
	}, [])

	useEffect(() => {
		if (selectedDate) {
			const fetchTimeSlots = async () => {
				try {
					const slots = await checkAvailableTimeSlots(selectedDate)
					setAvailableTimeSlots(slots)
					setTimeInterval(slots[0])
				} catch (error) {
					console.error(error)
				}
			}
			fetchTimeSlots()
		}
	}, [selectedDate])

	useEffect(() => {
		const fetchWarehouses = async () => {
			setLoading(true)
			try {
				const ozonWarehouses = await getWarehouses(1) // Используйте правильный ID для Ozon
				const yandexWarehouses = await getWarehouses(2) // Используйте правильный ID для Яндекс Маркет
				const wildberriesWarehouses = await getWarehouses(3) // Используйте правильный ID для Wildberries

				setWarehousesOzon(ozonWarehouses.data)
				setWarehousesYandex(yandexWarehouses.data)
				setWarehousesWildberries(wildberriesWarehouses.data)
				setLoading(false)
			} catch (error) {
				console.error('Ошибка при загрузке складов:', error)
				setLoading(false)
			}
		}

		fetchWarehouses()
	}, [])

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedRadio(e.target.id as any)
		setSelectedWarehouse(null)
		setDeliveryAddress('')
	}

	const handleRadioDeliveryTypeChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedDeliveryType(e.target.id as any)
	}

	const handleWarehouseSelect = (
		warehouseId: number,
		name: string,
		address: string
	) => {
		setSelectedWarehouse({ id: warehouseId, name })
		setDeliveryAddress(address)
	}

	const handleBoxSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBoxSize(e.target.value)
	}

	const handleAdditionalServicesChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const service = e.target.value
		setAdditionalServices(prev =>
			prev.includes(service)
				? prev.filter(s => s !== service)
				: [...prev, service]
		)
	}

	const handleWeightChange = (value: number) => {
		setBoxWeight(prev => Math.max(0, prev + value))
	}

	const handleBoxCountChange = (value: number) => {
		setBoxCount(prev => Math.max(1, prev + value))
	}

	const calculatePrice = () => {
		let price = 0

		if (selectedDeliveryType === 'Паллеты') {
			price = boxCount * PALLET_PRICE
			additionalServices.forEach(service => {
				price += boxCount * ADDITIONAL_SERVICES_COST[service]
			})
		} else if (selectedDeliveryType === 'Коробки') {
			const groupCount = Math.ceil(boxCount / BOXES_PER_GROUP)
			price = groupCount * PALLET_PRICE

			additionalServices.forEach(service => {
				price += groupCount * ADDITIONAL_SERVICES_COST[service]
			})
		}

		setEstimatedPrice(price)
	}

	useEffect(() => {
		calculatePrice()
	}, [selectedDeliveryType, boxCount, additionalServices])

	const checkPromoCode = async (code: string) => {
		try {
			const promo = await getPromoCode(code)
			const promoCode = promo.data[0]

			if (promoCode) {
				if (PromoUsed) {
					toast.error('Вы уже применили промокод к этой заявке')
					return false
				}
				if (promoCode.is_active === false) {
					toast.error('Промокод не активен')
					setPromocodeData(null)
					return false
				}

				const hasUsedPromo = await checkUserPromoCodeUsage(userID)
				if (hasUsedPromo) {
					toast.error('Вы уже использовали этот промокод')
					setPromocodeData(null)
					return false
				}

				if (
					promoCode.limit_of_uses === 0 ||
					promoCode.limit_of_uses > promoCode.count_of_uses
				) {
					const discount = promoCode.discount
					setPromocodeData({ discount })
					setEstimatedPrice(
						prevPrice => prevPrice - (prevPrice * discount) / 100
					)
					setPromoUsed(true)
					toast.success('Промокод успешно применен')
					return true
				} else {
					toast.error('Превышен лимит использований промокода')
					setPromocodeData(null)
					return false
				}
			}
		} catch (error) {
			toast.error('Такого промокода не существует')
			setPromocodeData(null)
			return false
		}
	}

	const checkUserPromoCodeUsage = async (userID: number) => {
		try {
			const response = await getUser(userID)
			const data = await response.data
			return data.used_promocodes.includes(promoCode)
		} catch (error) {
			console.error(
				'Ошибка при проверке использования промокода пользователем',
				error
			)
			return false
		}
	}

	const UpdateUseCountPromoCode = async (code: string) => {
		try {
			const promo = await getPromoCode(code)
			const promoCode = promo.data[0]
			if (promoCode) {
				const updatedPromoCode: PromoCode = {
					...promoCode,
					count_of_uses: promoCode.count_of_uses + 1,
				}
				await updatePromoCode(promoCode.id, updatedPromoCode)
			}
		} catch (error) {
			console.error(
				'Ошибка при обновлении количества использований промокода:',
				error
			)
		}
	}

	const UpdateOrdersCountUser = async (userID: number, promoCode?: string) => {
		try {
			if (userID) {
				const user = await getUser(userID)
				const userData = user.data

				let usedPromoCodes = Array.isArray(userData.used_promocodes)
					? userData.used_promocodes
					: []

				if (promoCode && !usedPromoCodes.includes(promoCode)) {
					usedPromoCodes.push(promoCode)
				}

				const updatedUser: User = {
					...userData,
					orders_count: userData.orders_count + 1,
					used_promocodes: usedPromoCodes,
				}

				await updateUser(userID, updatedUser)
			}
		} catch (error) {
			console.error(
				'Ошибка при обновлении количества заказов пользователя:',
				error
			)
		}
	}

	const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPromoCode = e.target.value

		if (PromoUsed) {
			if (isPromoApplied) {
				if (promocodeData) {
					const discountAmount =
						(estimatedPrice * promocodeData.discount) /
						(100 - promocodeData.discount)
					setEstimatedPrice(prevPrice => prevPrice + discountAmount)
					setPromocodeData(null)
				}
				setIsPromoApplied(false)
				setIsPromoCodeValid(null)
				setPromoUsed(false)
				toast.info('Промокод изменен, предыдущая скидка удалена')
			}
		}

		setPromoCode(newPromoCode)
	}
	const handlePromoCodeApply = async () => {
		if (promoCode.trim()) {
			const isValid = await checkPromoCode(promoCode)
			setIsPromoCodeValid(isValid ?? false)
			setIsPromoApplied(true)
		} else {
			toast.error('Пожалуйста, введите промокод')
		}
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (selectedWarehouse === null) {
			toast.error('Пожалуйста, выберите склад.')
			return
		}

		if (boxWeight === 0) {
			toast.error('Пожалуйста, введите вес короба.')
			return
		}

		if (boxCount === 0) {
			toast.error('Пожалуйста, введите количество коробов.')
			return
		}

		if (timeInterval === 'Выберите время отправки') {
			toast.error('Пожалуйста, выберите время отправки.')
			return
		}

		try {
			const order: Order = {
				ip: (event.target as any).ip.value,
				status: Status.PENDING,
				marketplace: selectedRadio,
				warehouse: selectedWarehouse.name,
				delivery_type: selectedDeliveryType,
				quantity: boxCount,
				box_size: boxSize,
				box_weight: boxWeight,
				extra_services:
					additionalServices.length > 0
						? additionalServices.join(', ')
						: 'Без доп. услуг',
				pickup_date: (event.target as any).pickupDate.value,
				pickup_time:
					timeInterval !== 'Выберите время отправки' ? timeInterval : '',
				pickup_address: (event.target as any).pickupAddress.value,
				contacts: contactInfo,
				comment: (event.target as any).comment.value || 'Без комментария',
				promocode: showPromoCode ? promoCode : 'Без промокода',
				price: estimatedPrice,
				author_id: userID || 0,
			}

			await createOrder(order)
			toast.success('Заявка успешно отправлена')

			UpdateUseCountPromoCode(promoCode)
			UpdateOrdersCountUser(userID || 0, showPromoCode ? promoCode : undefined)

			if (formRef.current) {
				formRef.current.reset()
				setSelectedRadio('Ozon')
				setSelectedWarehouse(null)
				setSelectedDeliveryType('Паллеты')
				setBoxSize('Стандартный (60x40x40)')
				setAdditionalServices([])
				setBoxWeight(0)
				setBoxCount(0)
				setTimeInterval('Выберите время отправки')
				setPromoCode('')
				setIsPromoCodeValid(null)
				setPromocodeData(null)
				setShowPromoCode(false)
				setIsPromoApplied(false)
				setPromoUsed(false)
				setContactInfo('')
				setSelectedDate('')
				setEstimatedPrice(0)
			}
		} catch (error) {
			console.error('Ошибка при отправке заявки:', error)
			toast.error('Ошибка при отправке заявки')
		}
	}

	const renderWarehouses = () => {
		let warehousesToDisplay: Warehouse[] = []

		switch (selectedRadio) {
			case 'Ozon':
				if (loading) {
					return (
						<div className={`${styles.warehouseContainer} mb-3`}>
							<div className={styles.loader}></div>
						</div>
					)
				} else {
					warehousesToDisplay = warehousesOzon
				}
				break
			case 'Яндекс Маркет':
				if (loading) {
					return (
						<div className={`${styles.warehouseContainer} mb-3`}>
							<div className={styles.loader}></div>
						</div>
					)
				} else {
					warehousesToDisplay = warehousesYandex
				}
				break
			case 'Wildberries':
				if (loading) {
					return (
						<div className={`${styles.warehouseContainer} mb-3`}>
							<div className={styles.loader}></div>
						</div>
					)
				} else {
					warehousesToDisplay = warehousesWildberries
				}
				break
			default:
				warehousesToDisplay = []
		}

		return (
			<div className={`${styles.warehouseContainer} mb-3`}>
				{warehousesToDisplay.map(warehouse => (
					<button
						key={warehouse.id}
						type='button'
						data-control-id='warehouse-button'
						className={`btn btn-outline-secondary ${styles.warehouseButton} ${
							selectedWarehouse?.id === warehouse.id ? styles.selected : ''
						}`}
						onClick={() =>
							handleWarehouseSelect(
								warehouse.id,
								warehouse.name,
								warehouse.description
							)
						}
					>
						<h6 className='mb-0'>{warehouse.name}</h6>
						<p className='mb-0'>{warehouse.description}</p>
					</button>
				))}
			</div>
		)
	}

	return (
		<div>
			<section id='submit' className={`container py-5 ${styles.container}`}>
				<h2 className='fw-bold mb-5 text-center'>
					<i className='bi bi-pencil-square text-primary me-2'></i> Подать
					заявку
				</h2>
				<form onSubmit={handleSubmit} ref={formRef}>
					<div className={`${styles.esrte_container}`}>
						<div className='mb-3'>
							<input
								type='text'
								className={`form-control mb-3 ${styles.form_control}`}
								placeholder='Введите ваш ИП'
								required
								name='ip'
							/>
						</div>
						<div className='mb-3'>
							<input
								type='text'
								className={`form-control mb-3 ${styles.form_control}`}
								placeholder='Введите адрес отправки'
								required
								name='pickupAddress'
							/>
						</div>
					</div>
					<div
						className={`btn-group mb-3 ${styles.radio_group}`}
						role='group'
						aria-label='Basic radio toggle button group'
					>
						<input
							type='radio'
							className='btn-check'
							name='Ozon'
							id='Ozon'
							autoComplete='off'
							checked={selectedRadio === 'Ozon'}
							onChange={handleRadioChange}
						/>
						<label
							className={`btn btn-outline-primary ${styles.radio_button}`}
							htmlFor='Ozon'
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/ozon.png`}
								alt=''
								width={25}
								height={25}
								className={`me-2 ${styles.Icon}`}
							/>
							Ozon
						</label>

						<input
							type='radio'
							className='btn-check'
							name='Яндекс Маркет'
							id='Яндекс Маркет'
							autoComplete='off'
							checked={selectedRadio === 'Яндекс Маркет'}
							onChange={handleRadioChange}
						/>
						<label
							className={`btn btn-outline-primary ${styles.radio_button}`}
							htmlFor='Яндекс Маркет'
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/ym3.jpg`}
								alt=''
								width={25}
								height={25}
								className={`me-2 ${styles.Icon}`}
							/>
							Яндекс Маркет
						</label>

						<input
							type='radio'
							className='btn-check'
							name='Wildberries'
							id='Wildberries'
							autoComplete='off'
							checked={selectedRadio === 'Wildberries'}
							onChange={handleRadioChange}
						/>
						<label
							className={`btn btn-outline-primary ${styles.radio_button}`}
							htmlFor='Wildberries'
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/wb.jpg`}
								alt=''
								width={25}
								height={25}
								className={`me-2 ${styles.Icon}`}
							/>
							Wildberries
						</label>
					</div>

					{renderWarehouses()}

					<div className={`mb-3 ${styles.TestContainer}`}>
						<h6 className='d-flex justify-content-center me-4 mb-3 mt-1'>
							Информация о грузе
						</h6>
						<div
							className={`btn-group mb-3 ${styles.radio_group}`}
							role='group'
							aria-label='Basic radio toggle button group'
						>
							<input
								type='radio'
								className={`btn-check`}
								name='Паллеты'
								id='Паллеты'
								autoComplete='off'
								checked={selectedDeliveryType === 'Паллеты'}
								onChange={handleRadioDeliveryTypeChange}
							/>
							<label
								className={`btn btn-outline-primary ${styles.radio_button} ${styles.radio_button_delivery_type}`}
								htmlFor='Паллеты'
							>
								Паллеты
							</label>

							<input
								type='radio'
								className={`btn-check ${styles.radio_button_delivery_type}`}
								name='Коробки'
								id='Коробки'
								autoComplete='off'
								checked={selectedDeliveryType === 'Коробки'}
								onChange={handleRadioDeliveryTypeChange}
							/>
							<label
								className={`btn btn-outline-primary ${styles.radio_button} ${styles.radio_button_delivery_type}`}
								htmlFor='Коробки'
							>
								Коробки
							</label>
						</div>
						<div className='container text-center mt-4'>
							<div className='row'>
								<div className='col'>
									<p className='d-flex justify-content-center'>Размеры</p>
									<div
										className='btn-group-vertical'
										role='group'
										aria-label='Vertical radio toggle button group'
									>
										<input
											type='radio'
											className='btn-check'
											name='vbtn-radio'
											id='vbtn-radio1'
											value='Маленький (30x20x20)'
											checked={boxSize === 'Маленький (30x20x20)'}
											onChange={handleBoxSizeChange}
										/>
										<label
											className={`btn btn-outline-primary`}
											htmlFor='vbtn-radio1'
										>
											Маленький (30x20x20)
										</label>
										<input
											type='radio'
											className='btn-check'
											name='vbtn-radio'
											id='vbtn-radio2'
											value='Стандартный (60x40x40)'
											checked={boxSize === 'Стандартный (60x40x40)'}
											onChange={handleBoxSizeChange}
										/>
										<label
											className='btn btn-outline-primary'
											htmlFor='vbtn-radio2'
										>
											Стандартный (60x40x40)
										</label>
										<input
											type='radio'
											className='btn-check'
											name='vbtn-radio'
											id='vbtn-radio3'
											value='Максимальный (120x80x40)'
											checked={boxSize === 'Максимальный (120x80x40)'}
											onChange={handleBoxSizeChange}
										/>
										<label
											className='btn btn-outline-primary'
											htmlFor='vbtn-radio3'
										>
											Максимальный (120x80x40)
										</label>
									</div>
								</div>
								<div className='col'>
									<p className='d-flex justify-content-center'>
										Дополнительные услуги
									</p>
									<div
										className='btn-group-vertical'
										role='group'
										aria-label='Basic checkbox toggle button group'
									>
										<input
											type='checkbox'
											className='btn-check'
											id='btncheck1'
											value='Паллет'
											onChange={handleAdditionalServicesChange}
											checked={additionalServices.includes('Паллет')}
										/>
										<label
											className={`btn btn-outline-primary ${styles.check_button}`}
											htmlFor='btncheck1'
										>
											Паллет
											<span className={`badge ms-2 ${styles.badge}`}>
												+200/шт ₽
											</span>
										</label>

										<input
											type='checkbox'
											className='btn-check'
											id='btncheck2'
											value='Паллетирование'
											onChange={handleAdditionalServicesChange}
											checked={additionalServices.includes('Паллетирование')}
										/>
										<label
											className={`btn btn-outline-primary ${styles.check_button}`}
											htmlFor='btncheck2'
										>
											Паллетирование
											<span className={`badge ms-2 ${styles.badge}`}>
												+350/шт ₽
											</span>
										</label>

										<input
											type='checkbox'
											className='btn-check'
											id='btncheck3'
											value='Погрузка'
											onChange={handleAdditionalServicesChange}
											checked={additionalServices.includes('Погрузка')}
										/>
										<label
											className={`btn btn-outline-primary ${styles.check_button}`}
											htmlFor='btncheck3'
										>
											Погрузка
											<span className={`badge ms-2 ${styles.badge}`}>
												+200/шт ₽
											</span>
										</label>
									</div>
								</div>
							</div>
							<div className={`row mt-4 pt-4 ${styles.Container_2}`}>
								<div className='col'>
									<p className='d-flex justify-content-center'>
										Вес короба, кг
									</p>
									<div className='input-group'>
										<button
											className='btn btn-outline-secondary'
											type='button'
											onClick={() => handleWeightChange(-5)}
										>
											-
										</button>
										<input
											type='text'
											className={`form-control ${styles.form_control}`}
											value={boxWeight}
											onChange={e => {
												const value = e.target.value

												if (/^\d*$/.test(value)) {
													setBoxWeight(Number(value))
												}
											}}
											min={0}
										/>
										<button
											className='btn btn-outline-secondary'
											type='button'
											onClick={() => handleWeightChange(5)}
										>
											+
										</button>
									</div>
								</div>
								<div className='col'>
									<p className='d-flex justify-content-center'>
										Количество коробов
									</p>
									<div className='input-group'>
										<button
											className='btn btn-outline-secondary'
											type='button'
											onClick={() => handleBoxCountChange(-1)}
										>
											-
										</button>
										<input
											type='text'
											className={`form-control ${styles.form_control}`}
											value={boxCount}
											onChange={e => {
												const value = e.target.value
												if (/^\d*$/.test(value)) {
													setBoxCount(Number(value))
												}
											}}
											min={1}
										/>
										<button
											className='btn btn-outline-secondary'
											type='button'
											onClick={() => handleBoxCountChange(1)}
										>
											+
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col'>
							<div className='mb-3'>
								<input
									type='date'
									className={`form-control mb-3 ${styles.form_control}`}
									name='pickupDate'
									required
									value={selectedDate}
									onChange={e => setSelectedDate(e.target.value)}
									min={minDate}
								/>
							</div>
						</div>
						<div className='col'>
							<div className='mb-3'>
								<select
									className={`form-control mb-3 ${styles.form_control}`}
									value={timeInterval}
									onChange={e => setTimeInterval(e.target.value)}
									name='pickupTime'
									required
								>
									{availableTimeSlots.length > 0 ? (
										availableTimeSlots.map((slot, index) => (
											<option
												className={`form-control ${styles.option_control}`}
												key={index}
												value={slot}
											>
												{slot}
											</option>
										))
									) : (
										<option>Нет доступных временных интервалов</option>
									)}
								</select>
							</div>
						</div>
					</div>
					<div className='mb-3'>
						<div className='mb-3'>
							<InputMask
								mask='+7 (___) ___-__-__'
								replacement={{ _: /\d/ }}
								placeholder='Номер телефона'
								className={`form-control mb-3 ${styles.form_control}`}
								required
								name='contactInfo'
								value={contactInfo}
								onChange={e => setContactInfo(e.target.value)}
							></InputMask>
						</div>
						<textarea
							className={`form-control ${styles.form_control}`}
							id='comment'
							rows={3}
							placeholder='Введите ваш комментарий'
							name='comment'
						></textarea>
					</div>
					<button
						type='button'
						className={`btn btn-link ${styles.promoCodeButton}`}
						onClick={() => setShowPromoCode(!showPromoCode)}
					>
						Есть промокод?
					</button>
					{showPromoCode && (
						<div className='d-flex mt-2'>
							<input
								type='text'
								value={promoCode}
								onChange={handlePromoCodeChange}
								placeholder='Введите промокод'
								className={`form-control ${styles.form_control}`}
							/>
							<button
								type='button'
								onClick={handlePromoCodeApply}
								className={`btn btn-primary ms-2 ${styles.SubmitButton}`}
							>
								Применить
							</button>
						</div>
					)}
					<div className={`p-3 my-4 ${styles.priceContainer}`}>
						<span className='text align-items-center'>
							Предварительная стоимость:{' '}
						</span>
						<span className='fw-bold'>{estimatedPrice} ₽</span>
						{promocodeData && (
							<span className='badge bg-primary ms-2 align-items-center'>
								-{promocodeData.discount}%
							</span>
						)}
					</div>
					<div className='text-center'>
						<button type='submit' className={`btn mt-4 ${styles.SubmitButton}`}>
							Отправить заявку
						</button>
					</div>
				</form>
			</section>
			<ToastContainer autoClose={1500} limit={3} />
		</div>
	)
}
