'use client'

import Footer from '@/components/Layout/Footer/Footer'
import LogoComponent from '@/components/Layout/Navbar/LogoComponent'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './Profile.module.css'

interface ProfileProps {
	orders: any[]
}

export default function Profile({ orders }: ProfileProps) {
	const router = useRouter()
	const [user, setUser] = useState(null)

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

	return (
		<div>
			<div className={`container mt-5 ${styles.container}`}>
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

				<div className='card shadow-sm border-0 mb-4'>
					<div className='card-body'>
						<h5 className='card-title'>
							<i className='bi bi-person-fill me-2'></i> Информация о
							пользователе
						</h5>
					</div>
				</div>

				<div className='card shadow-sm border-0'>
					<div className='card-body'>
						<h5 className='card-title'>
							<i className='bi bi-box-seam-fill me-2'></i> Мои заявки
						</h5>
						<div className='accordion pt-3' id='ordersAccordion'>
							{orders.length > 0 ? (
								orders.map((order, index) => (
									<div className='accordion-item' key={order.id}>
										<h2 className='accordion-header' id={`heading${index}`}>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={`#collapse${index}`}
												aria-expanded='false'
												aria-controls={`collapse${index}`}
											>
												<span className={`${statusColors[order.status]} me-3`}>
													{statusTranslations[order.status]}
												</span>
												Заявка №{order.id}
											</button>
										</h2>
										<div
											id={`collapse${index}`}
											className='accordion-collapse collapse'
											aria-labelledby={`heading${index}`}
											data-bs-parent='#ordersAccordion'
										>
											<div className='accordion-body'>
												<ul className='list-group list-group-flush'>
													<li className='list-group-item d-flex justify-content-between'>
														<strong>Статус:</strong>
														<span className={`${statusColors[order.status]}`}>
															{statusTranslations[order.status]}
														</span>
													</li>
													<li className='list-group-item'>
														<strong>ИП:</strong> {order.ip}
													</li>
													<li className='list-group-item'>
														<strong>Маркетплейс:</strong> {order.marketPlace}
													</li>
													<li className='list-group-item'>
														<strong>Склад:</strong> {order.warehouse}
													</li>
													<li className='list-group-item'>
														<strong>Тип доставки:</strong> {order.delivery_type}
													</li>
													<li className='list-group-item'>
														<strong>Количество:</strong> {order.quantity}
													</li>
													<li className='list-group-item'>
														<strong>Дополнительные услуги:</strong>{' '}
														{order.extra_services}
													</li>
													<li className='list-group-item'>
														<strong>Дата забора:</strong> {order.pickup_date}
													</li>
													<li className='list-group-item'>
														<strong>Время забора:</strong> {order.pickup_time}
													</li>
													<li className='list-group-item'>
														<strong>Адрес забора:</strong>{' '}
														{order.pickup_address}
													</li>
													<li className='list-group-item'>
														<strong>Контактная информация:</strong>{' '}
														{order.contact_info}
													</li>
													<li className='list-group-item'>
														<strong>Комментарий:</strong> {order.comment}
													</li>
													<li className='list-group-item'>
														<strong>Промо-код:</strong> {order.promo_code}
													</li>
													<li className='list-group-item'>
														<strong>Цена заказа:</strong> {order.order_price}{' '}
														руб.
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
