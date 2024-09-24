import { Order, Status } from '@/types/order.types'
import { User } from '@/types/user.types'
import Image from 'next/image'
import React from 'react'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import styles from './Orders.module.css'

interface OrdersTableProps {
	orders: Order[]
	viewSettings: { [key: string]: boolean }
	onEdit: (order: Order) => void
	onDelete: (order: Order) => void
	onUserClick: (user: User) => void
	onDoubleClick: (order: Order) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({
	orders,
	viewSettings = {},
	onEdit,
	onDelete,
	onUserClick,
	onDoubleClick,
}) => {
	const statusColors: Record<string, string> = {
		PENDING: `badge ${styles.badge_warning}`,
		DELIVERED: `badge ${styles.badge_success}`,
		CANCELED: `badge ${styles.badge_danger}`,
		CONFIRMED: `badge ${styles.badge_primary}`,
		OVERDUE: `badge ${styles.badge_overdue}`,
	}

	const statusTranslations: Record<string, { label: string; icon: string }> = {
		PENDING: { label: 'В ожидании', icon: 'bi bi-clock' },
		DELIVERED: { label: 'Доставлено', icon: 'bi bi-check-circle' },
		CANCELED: { label: 'Отменено', icon: 'bi bi-x-circle' },
		CONFIRMED: { label: 'Подтверждено', icon: 'bi bi-check2-circle' },
		OVERDUE: { label: 'Просрочено', icon: 'bi bi-exclamation-triangle' },
	}

	const market_placeBadges: Record<string, string | JSX.Element> = {
		Ozon: 'ozon.png',
		'Яндекс Маркет': 'ym3.jpg',
		Wildberries: 'wb.jpg',
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

	return (
		<div className={styles.table_container}>
			<div
				className={styles.table_container_responsive}
				style={{
					maxWidth: '100vw',
					overflowY: 'auto',
				}}
			>
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>№</th>
							{viewSettings.status !== false && (
								<th className={styles.flex_grow}>Статус</th>
							)}
							{viewSettings.user_id !== false && (
								<th className={styles.flex_grow}>Автор</th>
							)}
							{viewSettings.created_at !== false && (
								<th className={styles.flex_grow}>Дата создания</th>
							)}
							{viewSettings.ip !== false && (
								<th className={styles.flex_grow}>ИП</th>
							)}
							{viewSettings.market_place !== false && (
								<th className={styles.flex_grow}>Маркетплейс</th>
							)}
							{viewSettings.warehouse !== false && (
								<th className={styles.flex_grow}>Склад</th>
							)}
							{viewSettings.delivery_type !== false && (
								<th className={styles.flex_grow}>Тип доставки</th>
							)}
							{viewSettings.quantity !== false && (
								<th className={styles.flex_grow}>Количество</th>
							)}
							{viewSettings.box_weight !== false && (
								<th className={styles.flex_grow}>Вес короба</th>
							)}
							{viewSettings.box_size !== false && (
								<th className={styles.flex_grow}>Размер короба</th>
							)}
							{viewSettings.extra_services !== false && (
								<th className={styles.flex_grow}>Доп. услуги</th>
							)}
							{viewSettings.pickup_date !== false && (
								<th className={styles.flex_grow}>Дата забора</th>
							)}
							{viewSettings.pickup_time !== false && (
								<th className={styles.flex_grow}>Время забора</th>
							)}
							{viewSettings.pickup_address !== false && (
								<th className={styles.flex_grow}>Адрес забора</th>
							)}
							{viewSettings.contact_info !== false && (
								<th className={styles.flex_grow}>Контактная информация</th>
							)}
							{viewSettings.comment !== false && <th>Комментарий</th>}
							{viewSettings.promo_code !== false && (
								<th className={styles.flex_grow}>Промокод</th>
							)}
							{viewSettings.order_price !== false && (
								<th className={styles.flex_grow}>Предв. стоимость</th>
							)}
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order: any) => {
							const isDisabled =
								order.status === 'DELIVERED' || order.status === 'CANCELED'

							const status = statusTranslations[order.status || '']

							return (
								<tr
									onClick={() => onDoubleClick({ id: order.id })}
									key={order.id}
								>
									<td>{order.id}</td>
									{viewSettings.status !== false && (
										<td>
											<div className='d-flex align-items-center'>
												<span
													className={`${
														statusColors[order.status || '']
													} me-2 d-inline-flex align-items-center`}
												>
													<i className={`${status.icon} me-1`}></i>
													{status.label}
												</span>
												{order.status === Status.OVERDUE && (
													<i
														className={`bi bi-exclamation-triangle ${styles.triangle}`}
													></i>
												)}
											</div>
										</td>
									)}
									{viewSettings.author_id !== false && (
										<td>
											<span
												className={`badge ${styles.badge_dark}`}
												onClick={() => onUserClick({ id: order.author_id })}
												style={{ cursor: 'pointer' }}
											>
												#{order.author_id}
											</span>
										</td>
									)}
									{viewSettings.created_at !== false && (
										<td>
											{new Date(order.created_at ?? '').toLocaleDateString(
												'ru-RU',
												{
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												}
											)}
										</td>
									)}
									{viewSettings.ip !== false && <td>{order.ip}</td>}
									{viewSettings.marketplace !== false && (
										<td className={styles.flex_grow}>
											<Image
												src={`http://localhost:3000/images/icons/marketplaces/${
													market_placeBadges[order.marketplace || '']
												}`}
												className='me-1 ms-2'
												style={{ borderRadius: '20%' }}
												alt='market_place'
												width={20}
												height={20}
											/>
											{order.marketplace}
										</td>
									)}
									{viewSettings.warehouse !== false && (
										<td className={styles.flex_grow}>{order.warehouse}</td>
									)}
									{viewSettings.delivery_type !== false && (
										<td className={styles.flex_grow}>{order.delivery_type}</td>
									)}
									{viewSettings.quantity !== false && <td>{order.quantity}</td>}
									{viewSettings.box_weight !== false && (
										<td>{order.box_weight} кг</td>
									)}
									{viewSettings.box_size !== false && <td>{order.box_size}</td>}
									{viewSettings.extra_services !== false && (
										<td>{order.extra_services}</td>
									)}
									{viewSettings.pickup_date !== false && (
										<td>
											{new Date(order.pickup_date ?? '').toLocaleDateString(
												'ru-RU',
												{
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
												}
											)}
										</td>
									)}
									{viewSettings.pickup_time !== false && (
										<td>{order.pickup_time}</td>
									)}
									{viewSettings.pickup_address !== false && (
										<td>{order.pickup_address}</td>
									)}
									{viewSettings.contact_info !== false && (
										<td>{order.contacts}</td>
									)}
									{viewSettings.comment !== false && <td>{order.comment}</td>}
									{viewSettings.promo_code !== false && (
										<td className={styles.flex_grow}>
											{order.promocode === 'Без промокода' ? (
												<p> {order.promocode}</p>
											) : (
												<span className={`badge ${styles.badge_gray}`}>
													<span className='bi bi-tags me-1'></span>
													{order.promocode}
												</span>
											)}
										</td>
									)}
									{viewSettings.order_price !== false && (
										<td>{formatCurrency(order.price)}</td>
									)}
									<td>
										<ButtonGroup>
											<Button
												variant='warning'
												onClick={() => onEdit(order)}
												disabled={isDisabled}
												className={`${styles.btn_warning}`}
											>
												<i className='bi bi-pencil-square'></i>
											</Button>
											<Button
												variant='danger'
												onClick={() => onDelete(order)}
												disabled={isDisabled}
												className={`${styles.btn_danger}`}
											>
												<i className='bi bi-trash'></i>
											</Button>
										</ButtonGroup>
									</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		</div>
	)
}

export default OrdersTable
