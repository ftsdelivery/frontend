'use client'

import { useProfile } from '@/hooks/useProfile'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function Profile() {
	const router = useRouter()
	const { data, isLoading } = useProfile()
	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push('/'),
	})

	// Цвета для статусов и ролей
	const statusColors: Record<string, string> = {
		PENDING: 'badge bg-warning',
		DELIVERED: 'badge bg-success',
		CANCELED: 'badge bg-danger',
		CONFIRMED: 'badge bg-primary',
	}

	const roleColors: Record<string, string> = {
		USER: 'badge bg-secondary',
		ADMIN: 'badge bg-danger',
	}

	return (
		<div className='container mt-5'>
			<h1 className='mb-4'>Профиль</h1>
			<div>
				<button className='btn btn-danger' onClick={() => mutate()}>
					Выйти
				</button>
			</div>
			<div className='card mb-4'>
				<div className='card-body'>
					<h5 className='card-title'>
						<i className='bi bi-person-fill me-2'></i>
						Информация о пользователе
					</h5>
					<ul className='list-group list-group-flush'>
						<li className='list-group-item'>
							<i className='bi bi-envelope-fill me-2'></i>
							<strong>Email:</strong> {data?.user.email}
						</li>
						<li className='list-group-item'>
							<i className='bi bi-person-fill me-2'></i>
							<strong>Имя:</strong> {data?.user.name}
						</li>
						<li className='list-group-item'>
							<i className='bi bi-shield-lock-fill me-2'></i>
							<strong>Роль:</strong>{' '}
							<span className={roleColors[data?.user.role ?? '']}>
								{data?.user.role}
							</span>
						</li>
						<li className='list-group-item'>
							<i className='bi bi-cart-fill me-2'></i>
							<strong>Количество заказов:</strong> {data?.user.orders_count}
						</li>
						<li className='list-group-item'>
							<i className='bi bi-tags-fill me-2'></i>
							<strong>Использованные промо-коды:</strong>{' '}
							{data?.user.used_promo_codes}
						</li>
					</ul>
				</div>
			</div>

			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>
						<i className='bi bi-box-seam-fill me-2'></i>
						Моя заявки
					</h5>
					<div className='accordion' id='ordersAccordion'>
						{data?.user.orders?.map((order, index) => (
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
										<span className={`${statusColors[order.status]}`}>
											{order.status}
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
											<li className='list-group-item'>
												<strong>Статус:</strong> {order.status}
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
												<strong>Тип доставки:</strong> {order.deliveryType}
											</li>
											<li className='list-group-item'>
												<strong>Количество:</strong> {order.quantity}
											</li>
											<li className='list-group-item'>
												<strong>Дополнительные услуги:</strong>{' '}
												{order.extraServices}
											</li>
											<li className='list-group-item'>
												<strong>Дата забора:</strong> {order.pickupDate}
											</li>
											<li className='list-group-item'>
												<strong>Время забора:</strong> {order.pickupTime}
											</li>
											<li className='list-group-item'>
												<strong>Адрес забора:</strong> {order.pickupAddress}
											</li>
											<li className='list-group-item'>
												<strong>Контактная информация:</strong>{' '}
												{order.contactInfo}
											</li>
											<li className='list-group-item'>
												<strong>Комментарий:</strong> {order.comment}
											</li>
											<li className='list-group-item'>
												<strong>Промо-код:</strong> {order.promoCode}
											</li>
											<li className='list-group-item'>
												<strong>Цена заказа:</strong> {order.orderPrice} руб.
											</li>
										</ul>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
