'use client'

import { createOrder } from '@/services/order.service'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import InputMask from 'react-input-mask'
import { ToastContainer, toast } from 'react-toastify'
import styles from './SubmitSection.module.css'

export default function SubmitSectionComponent() {
	const formRef = useRef<HTMLFormElement>(null)
	const [selectedRadio, setSelectedRadio] = useState<
		'Ozon' | 'Яндекс Маркет' | 'Wildberries'
	>('Ozon')

	const [selectedDeliveryType, setSelectedDeliveryType] = useState<
		'Паллеты' | 'Коробки'
	>('Паллеты')

	const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
		null
	)

	const [deliveryAddress, setDeliveryAddress] = useState<string>('')
	const [boxSize, setBoxSize] = useState<string>('Стандартный (60x40x40)')
	const [additionalServices, setAdditionalServices] = useState<string[]>([])
	const [boxWeight, setBoxWeight] = useState<number>(0)
	const [boxCount, setBoxCount] = useState<number>(1)
	const [timeInterval, setTimeInterval] = useState<string>(
		'Выберите время отправки'
	)

	const [showPromoCode, setShowPromoCode] = useState<boolean>(false)
	const [promoCode, setPromoCode] = useState<string>('')

	const [estimatedPrice, setEstimatedPrice] = useState<number>(0)

	const PALLET_PRICE = 2000
	const BOXES_PER_GROUP = 16
	const ADDITIONAL_SERVICES_COST: { [key: string]: number } = {
		Паллет: 200,
		Паллетирование: 350,
		Погрузка: 200,
	}

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

	const handleWarehouseSelect = (warehouseId: number, address: string) => {
		setSelectedWarehouse(warehouseId)
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

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
			createOrder({
				ip: (event.target as any).ip.value,
				marketPlace: selectedRadio,
				warehouse: selectedWarehouse.toString(),
				delivery_type: selectedDeliveryType,
				quantity: boxCount,
				extra_services:
					additionalServices.length > 0
						? additionalServices.join(', ')
						: 'Без дополнительных услуг',
				pickup_date: (event.target as any).pickupDate.value,
				pickup_time:
					timeInterval !== 'Выберите время отправки' ? timeInterval : '',
				pickup_address: (event.target as any).pickupAddress.value,
				contact_info: (event.target as any).contactInfo.value,
				comment: (event.target as any).comment.value || 'Без комментария',
				promo_code: showPromoCode
					? (event.target as any).promoCode.value
					: 'Без промокода',
				order_price: estimatedPrice,
				user_id: '1',
			}).then(() => {
				toast.success('Заявка успешно отправлена')
				if (formRef.current) {
					formRef.current.reset()
					setSelectedRadio('Ozon')
					setSelectedWarehouse(null)
					setSelectedDeliveryType('Паллеты')
					setBoxSize('Стандартный (60x40x40)')
					setAdditionalServices([])
					setTimeInterval('Выберите время отправки')
					setEstimatedPrice(0)
					setPromoCode('')
					setShowPromoCode(false)
					setBoxCount(1)
					setBoxWeight(0)
				}
			})
		} catch (error) {
			console.error(error)
			toast.error('Произошла ошибка при отправке заявки')
		}
	}
	const renderWarehouses = () => {
		const warehousesOzon = [
			{ id: 1, name: 'Склад 1', description: 'Москва, ул. Ленина, 1' },
			{ id: 2, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 3, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 4, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
			{ id: 5, name: 'Склад 1', description: 'Москва, ул. Ленина, 1' },
			{ id: 6, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 7, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 8, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
		]

		const warehousesYandex = [
			{ id: 1, name: 'Склад 50', description: 'Москва, ул. Ленина, 1' },
			{ id: 2, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 3, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 4, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
			{ id: 5, name: 'Склад 1', description: 'Москва, ул. Ленина, 1' },
			{ id: 6, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 7, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 8, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
		]

		const warehousesWildberries = [
			{ id: 1, name: 'Склад 100', description: 'Москва, ул. Ленина, 1' },
			{ id: 2, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 3, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 4, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
			{ id: 5, name: 'Склад 1', description: 'Москва, ул. Ленина, 1' },
			{ id: 6, name: 'Склад 2', description: 'Москва, ул. Пушкина, 10' },
			{ id: 7, name: 'Склад 3', description: 'Москва, ул. Пушкина, 12' },
			{ id: 8, name: 'Склад 4', description: 'Москва, ул. Пушкина, 15' },
		]

		let warehousesToDisplay = []

		switch (selectedRadio) {
			case 'Ozon':
				warehousesToDisplay = warehousesOzon
				break
			case 'Яндекс Маркет':
				warehousesToDisplay = warehousesYandex
				break
			case 'Wildberries':
				warehousesToDisplay = warehousesWildberries
				break
			default:
				return null
		}

		return (
			<div className={`${styles.warehouseContainer} mb-3`}>
				{warehousesToDisplay.map(warehouse => (
					<button
						key={warehouse.id}
						type='button'
						className={`btn btn-outline-secondary ${styles.warehouseButton} ${
							selectedWarehouse === warehouse.id ? styles.selected : ''
						}`}
						onClick={() =>
							handleWarehouseSelect(warehouse.id, warehouse.description)
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
								src={`http://localhost:3000/icons/ozon.png`}
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
								src={`http://localhost:3000/icons/ym3.jpg`}
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
								src={`http://localhost:3000/icons/wb.jpg`}
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
												+200 ₽
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
												+350 ₽
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
												+200 ₽
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
									<option value='Выберите время отправки' disabled>
										{' '}
										Выберите время отправки
									</option>
									<option value='10:00'>10:00</option>
									<option value='12:00'>12:00</option>
									<option value='14:00'>14:00</option>
								</select>
							</div>
						</div>
					</div>
					<div className='mb-3'>
						<div className='mb-3'>
							<InputMask
								mask='+7 (999) 999-99-99'
								maskChar='_'
								placeholder='Номер телефона'
								className={`form-control mb-3 ${styles.form_control}`}
								required
								name='contactInfo'
							></InputMask>
						</div>
						{/* <input
							type='email'
							className={`form-control mb-3 ${styles.form_control}`}
							placeholder='Почта (не обязательно)'
							name='email'
						/> */}
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
						<input
							type='text'
							className={`form-control mb-3 mt-3 ${styles.form_control}`}
							id='PromoCode'
							placeholder='Введите промокод'
							value={promoCode}
							name='promoCode'
							onChange={e => setPromoCode(e.target.value)}
						/>
					)}
					<div className={`p-3 my-4 ${styles.priceContainer}`}>
						<span className='text'>Предварительная стоимость: </span>
						<span className='fw-bold'>{estimatedPrice} ₽</span>
					</div>
					<div className='text-center'>
						<button type='submit' className={`btn mt-4 ${styles.SubmitButton}`}>
							Отправить заявку
						</button>
					</div>
				</form>
			</section>
			<ToastContainer autoClose={1500} />
		</div>
	)
}
