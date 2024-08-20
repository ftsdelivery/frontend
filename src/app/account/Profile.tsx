'use client'

import Footer from '@/components/Layout/Footer/Footer'
import LogoComponent from '@/components/Layout/Navbar/LogoComponent'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './Profile.module.css'

interface ProfileProps {
	orders: any[]
}

export default function Profile({ orders }: ProfileProps) {
	const router = useRouter()
	const [searchText, setSearchText] = useState('')
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
	const [showNewOrders, setShowNewOrders] = useState(false)

	const statusColors: Record<string, string> = {
		PENDING: 'badge bg-warning text-dark',
		DELIVERED: 'badge bg-success',
		CANCELED: 'badge bg-danger',
		CONFIRMED: 'badge bg-primary',
	}

	const statusTranslations: Record<string, string> = {
		PENDING: 'В ожидании',
		DELIVERED: 'Доставлено',
		CANCELED: 'Отменено',
		CONFIRMED: 'Подтверждено',
	}

	const MarketPlaceBadges: Record<string, string | JSX.Element> = {
		Ozon: 'ozon.png',
		'Яндекс Маркет': 'ym3.jpg',
		Wildberries: 'wb.jpg',
	}

	const isNewOrder = (order: any) => {
		const orderAgeHours =
			(new Date().getTime() - new Date(order.created_at).getTime()) / 3600000
		return orderAgeHours <= 12
	}

	// Фильтрация по статусу
	const filteredByStatusOrders = selectedStatus
		? orders.filter(order => order.status === selectedStatus)
		: orders

	// Фильтрация по флагу "Новые"
	const filteredByNewOrders = showNewOrders
		? filteredByStatusOrders.filter(isNewOrder)
		: filteredByStatusOrders

	// Фильтрация по введенному тексту
	const finalFilteredOrders = filteredByNewOrders.filter(order =>
		order.id.toString().includes(searchText)
	)

	return (
		<div className={styles.Main}>
			<div className={`container ${styles.container}`}>
				<div className='d-flex justify-content-between align-items-center mb-4'>
					<div className='d-flex align-items-center'>
						<LogoComponent width={175} height={175} />
					</div>
					<div>
						<button
							className='btn btn-primary btn-md me-2'
							onClick={() => router.push('/control-panel')}
						>
							<i className='bi bi-shield-lock me-2'></i>
							Панель управления
						</button>
						<button
							className='btn btn-danger btn-md'
							onClick={() =>
								signOut({
									redirect: true,
									callbackUrl: '/',
								})
							}
						>
							<i className='bi bi-box-arrow-right me-2'></i>
							Выйти
						</button>
					</div>
				</div>

				<div className={`card ${styles.card}`}>
					<div className={`card-body ${styles.card_body}`}>
						<h5 className={`card-title ${styles.card_title}`}>
							<i className='bi bi-person-fill me-2'></i> Пользовательская
							информация
						</h5>
					</div>
				</div>

				<div className={`card ${styles.card} mt-5 mb-5`}>
					<div className={`card-body ${styles.card_body} mb-3 mt-3`}>
						<div className='container'>
							<div className='row'>
								<div className='col align-self-start'>
									<h5 className={`card-title ${styles.card_title}`}>
										<i className='bi bi-box-seam-fill me-2'></i> Мои заявки
									</h5>
								</div>
								{/* <div className={`col`}>
									<div className={`form-check form-switch ms-3`}>
										<input
											className='form-check-input'
											type='checkbox'
											id='newOrdersSwitch'
											checked={showNewOrders}
											onChange={() => setShowNewOrders(!showNewOrders)}
										/>
										<label
											className='form-check-label'
											htmlFor='newOrdersSwitch'
										>
											Показать только новые заявки
										</label>
									</div>
								</div> */}
								<div className={`col align-self-end ${styles.col_2}`}>
									<input
										type='text'
										className={`form-control ${styles.form_control}`}
										placeholder='Поиск по № заявки'
										value={searchText}
										onChange={e => {
											const value = e.target.value.replace(/[^0-9]/g, '')
											setSearchText(value)
										}}
										inputMode='numeric'
										pattern='[0-9]*'
									/>
								</div>
								<div className={`col align-self-end ${styles.col_2}`}>
									<select
										className={`form-select text-align-center ${styles.form_control}`}
										value={selectedStatus || ''}
										onChange={e => setSelectedStatus(e.target.value || null)}
									>
										<option className={styles.option} value=''>
											Все статусы
										</option>
										<option className={styles.option_pending} value='PENDING'>
											В ожидании
										</option>
										<option
											className={styles.option_delivered}
											value='DELIVERED'
										>
											Доставлено
										</option>
										<option className={styles.option_canceled} value='CANCELED'>
											Отменено
										</option>
										<option
											className={styles.option_confirmed}
											value='CONFIRMED'
										>
											Подтверждено
										</option>
									</select>
								</div>
							</div>
						</div>

						<div
							className={`accordion pt-3 mt-4 ${styles.accordion}`}
							id='ordersAccordion'
						>
							{finalFilteredOrders.length > 0 ? (
								finalFilteredOrders.map((order, index) => (
									<div
										className={`accordion-item ${styles.accordion_item}`}
										key={order.id}
									>
										<h2
											className={`accordion-header ${styles.accordion_header}`}
											id={`heading${index}`}
										>
											<button
												className={`accordion-button ${styles.accordion_button} collapsed d-flex justify-content-between align-items-center`}
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={`#collapse${index}`}
												aria-expanded='false'
												aria-controls={`collapse${index}`}
											>
												<div className='d-flex w-100 justify-content-between align-items-center'>
													<span>
														<span
															className={`${statusColors[order.status]} me-3`}
														>
															{statusTranslations[order.status]}
														</span>
														Заявка №{order.id}
													</span>
													{isNewOrder(order) && (
														<span className='badge rounded-pill text-bg-danger ms-auto me-3'>
															Новое
														</span>
													)}
												</div>
											</button>
										</h2>
										<div
											id={`collapse${index}`}
											className={`accordion-collapse collapse ${styles.accordion_collapse}`}
											aria-labelledby={`heading${index}`}
											data-bs-parent='#ordersAccordion'
										>
											<div
												className={`accordion-body ${styles.accordion_body}`}
											>
												<ul className='list-group list-group-flush'>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>ИП:</strong> {order.ip}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Маркетплейс:</strong>{' '}
														<Image
															src={`http://localhost:3000/icons/${
																MarketPlaceBadges[order.marketPlace]
															}`}
															className='me-1 ms-2'
															alt='Marketplace'
															width={20}
															height={20}
														/>
														{order.marketPlace}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Склад:</strong> {order.warehouse}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Тип доставки:</strong> {order.delivery_type}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Количество:</strong> {order.quantity}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Дополнительные услуги:</strong>{' '}
														{order.extra_services}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Дата забора:</strong> {order.pickup_date}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Время забора:</strong> {order.pickup_time}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Адрес забора:</strong>{' '}
														{order.pickup_address}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Контактная информация:</strong>{' '}
														{order.contact_info}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Комментарий:</strong> {order.comment}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Промо-код:</strong> {order.promo_code}
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Предварительная стоимость:</strong>{' '}
														{order.order_price} руб.
													</li>
													<li
														className={`list-group-item ${styles.list_group_item}`}
													>
														<strong>Дата создания:</strong>{' '}
														{new Date(order.created_at).toLocaleString()}
													</li>
												</ul>
											</div>
										</div>
									</div>
								))
							) : (
								<h6 className='mt-2 text-center text-muted'>
									У вас нет заявок
								</h6>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
