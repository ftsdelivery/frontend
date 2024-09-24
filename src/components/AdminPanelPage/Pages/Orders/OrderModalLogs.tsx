import { getLogsByTargetId } from '@/services/log.service'
import { Log } from '@/types/log.types'
import { Order } from '@/types/order.types'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'react-bootstrap'
import styles from './Orders.module.css'

interface OrderModalProps {
	show: boolean
	onHide: () => void
	order: Order | null
}

const actionColors: Record<string, string> = {
	CREATE: `badge ${styles.badge_success}`,
	DELETE: `badge ${styles.badge_danger}`,
	UPDATE: `badge ${styles.badge_primary}`,
}

const actionTranslations: Record<string, string> = {
	CREATE: 'Создано',
	DELETE: 'Удалено',
	UPDATE: 'Обновлено',
}

const targetColors: Record<string, string> = {
	ORDER: `badge ${styles.badge_gray}`,
	PROMOCODE: `badge ${styles.badge_gray}`,
}

const targetTranslations: Record<string, string> = {
	ORDER: 'Заявка',
	PROMOCODE: 'Промокод',
}

const OrderModalLogs: React.FC<OrderModalProps> = ({ show, onHide, order }) => {
	const [logs, setLogs] = useState<Log[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (show && order) {
			setLoading(true)
			setError(null)

			// Загружаем логи для выбранного заказа
			getLogsByTargetId(order.id || 0)
				.then(data => {
					console.log(data)
					setLogs(data.data)
					setLoading(false)
				})
				.catch(err => {
					setError('Ошибка загрузки логов')
					setLoading(false)
				})
		}
	}, [show, order])

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'dd.MM.yyyy HH:mm:ss')
	}

	if (!order) {
		return null
	}

	return (
		<Modal show={show} onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Логи по заявке #{order.id}</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
				{loading ? (
					<div className='d-flex justify-content-center'>
						<Spinner animation='border' role='status'>
							<span className='sr-only'>Загрузка...</span>
						</Spinner>
					</div>
				) : error ? (
					<p>{error}</p>
				) : logs && logs.length > 0 ? (
					<div style={{ overflowX: 'auto' }}>
						<Table striped bordered hover className={styles.customTable}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Тип действия</th>
									<th>Имя цели</th>
									<th>Автор</th>
									<th>Дата</th>
									<th>Старое значение</th>
									<th>Новое значение</th>
								</tr>
							</thead>
							<tbody>
								{logs.map(log => (
									<tr key={log.id}>
										<td>{log.id}</td>
										<td>
											<span
												className={`${
													actionColors[log.action_type || '']
												} me-3`}
											>
												{actionTranslations[log.action_type || '']}
											</span>
										</td>
										<td>
											{' '}
											<span
												className={`${
													targetColors[log.target_name || '']
												} me-3`}
											>
												{targetTranslations[log.target_name || '']}
											</span>
										</td>
										<td>
											<span className={`badge ${styles.badge_dark}`}>
												#{log.author_id}
											</span>
										</td>
										<td>{formatDate(log.created_at || '-')}</td>
										<td>{log.old_value || '—'}</td>
										<td>{log.new_value || '—'}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				) : (
					<p>Логи не найдены</p>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Закрыть
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default OrderModalLogs
