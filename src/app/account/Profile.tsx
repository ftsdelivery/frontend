'use client'

import Footer from '@/components/Layout/Footer/Footer'
import LogoComponent from '@/components/Layout/Navbar/LogoComponent'
import Badge from '@/components/ui/Badge/Badge'
import { deleteOrder, updateOrder } from '@/services/order.service'
import { getUser } from '@/services/user.service'
import { Order, Status } from '@/types/order.types'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'
import styles from './Profile.module.css'

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

export default function Profile() {
	const { data: sessionData, status } = useSession()
	const session =
		status === 'authenticated'
			? (sessionData as unknown as CustomSession)
			: null
	const userId = session?.user.id
	const [userData, setUserData] = useState<any>([])
	const [orders, setOrders] = useState<any>([])
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const [searchText, setSearchText] = useState('')
	const [selectedStatus, setSelectedStatus] = useState<
		keyof typeof Status | null
	>(null)
	const [showNewOrders, setShowNewOrders] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const variantMapping: Record<
		string,
		'primary' | 'success' | 'danger' | 'warning' | 'secondary'
	> = {
		PENDING: 'warning',
		DELIVERED: 'success',
		CANCELED: 'danger',
		CONFIRMED: 'primary',
		OVERDUE: 'danger',
	}

	const statusTranslations: Record<string, string> = {
		PENDING: 'В ожидании',
		DELIVERED: 'Доставлено',
		CANCELED: 'Отменено',
		CONFIRMED: 'Подтверждено',
		OVERDUE: 'Просрочено',
	}

	const MarketPlaceBadges: Record<string, string | JSX.Element> = {
		Ozon: 'ozon.png',
		'Яндекс Маркет': 'ym3.jpg',
		Wildberries: 'wb.jpg',
	}

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true)
			const user = await getUser(userId || 0)
			setUserData(user.data || [])
			setOrders(user.data.orders.data || [])
			setLoading(false)
		}
		if (status === 'authenticated') {
			fetchUserData()
		}
	}, [status, userId])

	const isNewOrder = (order: any) => {
		const orderAgeHours =
			(new Date().getTime() - new Date(order.created_at).getTime()) / 3600000
		return orderAgeHours <= 12
	}

	const formatCurrency = (value: number | undefined): string => {
		if (value === undefined || value === null) {
			return ''
		}
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(value)
	}

	const filteredByStatusOrders = useMemo(
		() =>
			selectedStatus
				? orders.filter(
						(order: Order) => order.status === Status[selectedStatus]
				  )
				: orders,
		[orders, selectedStatus]
	)

	const filteredByNewOrders = useMemo(
		() =>
			showNewOrders
				? filteredByStatusOrders.filter(isNewOrder)
				: filteredByStatusOrders,
		[filteredByStatusOrders, showNewOrders]
	)

	const finalFilteredOrders = useMemo(
		() =>
			(filteredByNewOrders || []).filter(
				(order: Order) => order.id && order.id.toString().includes(searchText)
			),
		[filteredByNewOrders, searchText]
	)

	const handleEditClick = (order: Order) => {
		setSelectedOrder(order)
		setShowEditModal(true)
	}

	const handleCloseEditModal = () => {
		setShowEditModal(false)
	}

	const handleDeleteClick = (order: Order) => {
		setSelectedOrder(order)
		setShowDeleteModal(true)
	}

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false)
	}

	const handleSaveChanges = async () => {
		if (selectedOrder) {
			try {
				await updateOrder(selectedOrder.id || 0, selectedOrder)
				setShowEditModal(false)
				// Перезагрузить данные пользователя
			} catch (error) {
				console.error('Ошибка при обновлении заявки:', error)
			}
		}
	}

	// Обработчик для удаления заявки
	const handleDeleteOrder = async () => {
		if (selectedOrder) {
			try {
				await deleteOrder(selectedOrder.id || 0)
				setShowDeleteModal(false)
				// Перезагрузить данные пользователя
			} catch (error) {
				console.error('Ошибка при удалении заявки:', error)
			}
		}
	}

	return (
		<div className={styles.Main}>
			<div className={`container ${styles.container}`}>
				<div className='d-flex justify-content-between align-items-center mb-4'>
					<div className='d-flex align-items-center'>
						<LogoComponent width={175} height={175} />
					</div>
					<div>
						{userData.role === 'ADMINISTRATOR' ||
						userData.role === 'MANAGER' ? (
							<button
								className='btn btn-primary btn-md me-2'
								onClick={() => router.push('/control-panel')}
							>
								<i className='bi bi-shield-lock me-2'></i>
								Панель управления
							</button>
						) : null}
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
										onChange={e => {
											setSelectedStatus(e.target.value as keyof typeof Status)
										}}
									>
										<option className={styles.option} value=''>
											Все статусы
										</option>
										<option
											className={styles.option_pending}
											value={Status.PENDING}
										>
											В ожидании
										</option>
										<option
											className={styles.option_confirmed}
											value={Status.CONFIRMED}
										>
											Подтверждено
										</option>
										<option
											className={styles.option_delivered}
											value={Status.DELIVERED}
										>
											Доставлено
										</option>
										<option className={styles.option_canceled} value='CANCELED'>
											Отменено
										</option>
									</select>
								</div>
							</div>
						</div>

						{loading ? (
							<Alert className={`${styles.LoaderContainer} mt-5`}>
								<div className={styles.loader}></div>
							</Alert>
						) : (
							<div
								className={`accordion mt-4 ${styles.accordion}`}
								id='ordersAccordion'
							>
								{finalFilteredOrders.length > 0 ? (
									finalFilteredOrders.map((order: any, index: any) => (
										<div
											className={`accordion-item mt-1 ${styles.accordion_item}`}
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
															<Badge
																size='md'
																fw='bold'
																variant={`${variantMapping[order.status]}`}
															>
																{statusTranslations[order.status]}
															</Badge>{' '}
															| Заявка №{order.id}
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
															<strong>Дата создания:</strong>{' '}
															{new Date(order.created_at).toLocaleString()}
														</li>
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
																src={`http://localhost:3000/images/icons/marketplaces/${
																	MarketPlaceBadges[order.marketplace]
																}`}
																className='me-1 ms-2'
																alt='Marketplace'
																width={20}
																height={20}
															/>
															{order.marketplace}
														</li>
														<li
															className={`list-group-item ${styles.list_group_item}`}
														>
															<strong>Склад:</strong> {order.warehouse}
														</li>
														<li
															className={`list-group-item ${styles.list_group_item}`}
														>
															<strong>Тип доставки:</strong>{' '}
															{order.delivery_type}
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
															{order.contacts}
														</li>
														<li
															className={`list-group-item ${styles.list_group_item}`}
														>
															<strong>Комментарий:</strong> {order.comment}
														</li>
														<li
															className={`list-group-item ${styles.list_group_item}`}
														>
															<strong>Промо-код:</strong>{' '}
															{order.promocode === 'Без промокода' ? (
																<p> {order.promocode}</p>
															) : (
																<span className='badge bg-secondary'>
																	{order.promocode}
																</span>
															)}
														</li>
														<li
															className={`list-group-item ${styles.list_group_item}`}
														>
															<strong>Предварительная стоимость: </strong>
															{formatCurrency(order.price)}
														</li>
														<li className='mt-3 d-flex flex-column align-items-center justify-content-center'>
															{/* Проверка на статус PENDING */}
															{order.status === 'PENDING' ? (
																<>
																	{/* Пустой элемент для отступа */}
																	<div style={{ marginBottom: '0.5rem' }}></div>
																	{/* Контейнер для кнопок, чтобы они располагались рядом */}
																	<div className='d-flex'>
																		<button
																			className='btn btn-warning me-2'
																			onClick={() => handleEditClick(order)}
																		>
																			<i className='bi bi-pencil-square'></i>{' '}
																			Редактировать
																		</button>
																		<button
																			className='btn btn-danger ms-2'
																			onClick={() => handleDeleteClick(order)}
																		>
																			<i className='bi bi-x-lg'></i> Отменить
																		</button>
																	</div>
																</>
															) : (
																<>
																	{/* Компактная предупреждающая табличка */}
																	<div
																		className='alert alert-danger'
																		style={{
																			width: 'auto',
																			fontSize: '0.75rem',
																			padding: '0.5rem',
																			marginBottom: '0.5rem',
																		}}
																	>
																		<i
																			className={`bi bi-exclamation-triangle ${styles.orange_icon}`}
																		></i>{' '}
																		Ваша заявка была подтверждена менеджером.
																		Самостоятельное редактирование недоступно.
																		Для внесения изменений или отмены заявки,
																		пожалуйста, обратитесь в{' '}
																		<Link href='/support'>
																			службу поддержки
																		</Link>
																	</div>
																	{/* Кнопки становятся неактивными и размещены под предупреждением */}
																	<div className='d-flex align-items-center'>
																		<button
																			className='btn btn-warning me-2'
																			disabled
																		>
																			<i className='bi bi-pencil-square'></i>{' '}
																			Редактировать
																		</button>
																		<button
																			className='btn btn-danger ms-2'
																			disabled
																		>
																			<i className='bi bi-x-lg'></i> Отменить
																		</button>
																	</div>
																</>
															)}
														</li>
													</ul>
												</div>
											</div>
										</div>
									))
								) : (
									<h6 className='mt-2 text-center pb-3'>У вас нет заявок</h6>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<Modal show={showEditModal} onHide={handleCloseEditModal}>
				<Modal.Header closeButton>
					<Modal.Title>Редактировать заявку №{selectedOrder?.id}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* Форма для редактирования заявки */}
					<div className='mb-3'>
						<label>Количество:</label>
						<input
							type='number'
							className='form-control'
							value={selectedOrder?.quantity || ''}
							onChange={e =>
								setSelectedOrder(prev => ({
									...prev,
									quantity: parseInt(e.target.value),
								}))
							}
						/>
					</div>
					<div className='mb-3'>
						<label>Комментарий:</label>
						<textarea
							className='form-control'
							value={selectedOrder?.comment || ''}
							onChange={e =>
								setSelectedOrder(prev => ({
									...prev,
									comment: e.target.value,
								}))
							}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseEditModal}>
						Закрыть
					</Button>
					<Button variant='primary' onClick={handleSaveChanges}>
						Сохранить изменения
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Модальное окно для подтверждения удаления заявки */}
			<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
				<Modal.Header closeButton>
					<Modal.Title>Подтверждение удаления</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Вы действительно хотите удалить заявку №{selectedOrder?.id}?
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseDeleteModal}>
						Отменить
					</Button>
					<Button variant='danger' onClick={handleDeleteOrder}>
						Удалить
					</Button>
				</Modal.Footer>
			</Modal>
			<Footer />
		</div>
	)
}
