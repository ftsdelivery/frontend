'use client'

import {
	getTickets,
	removeTicket,
	updateTicket,
} from '@/services/ticket.service'
import { Ticket } from '@/types/ticket.types'
import { getSession } from 'next-auth/react' // Импортируем getSession
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form, Modal, Table } from 'react-bootstrap'
import { toast } from 'sonner'
import styles from './../Orders/Orders.module.css'

const Support = () => {
	const [tickets, setTickets] = useState<Ticket[]>([])
	const [loading, setLoading] = useState(true)
	const [noTickets, setNoTickets] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
	const [adminReply, setAdminReply] = useState<string>('')

	// Функция для получения тикетов
	const fetchTickets = useCallback(async () => {
		setLoading(true)
		try {
			const data = await getTickets()
			if (data.length === 0) {
				setNoTickets(true)
			} else {
				setNoTickets(false)
				setTickets(data.data)
			}
		} catch (error) {
			setNoTickets(true)
			setTickets([])
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchTickets()
	}, [fetchTickets])

	// Функция для обновления статуса тикета и добавления ответа
	const handleUpdateReply = async (ticket: Ticket) => {
		if (adminReply) {
			try {
				const session = await getSession()
				const adminId = Number(session?.user?.id)

				const updatedTicket = {
					...ticket,
					admin_reply: adminReply,
					admin_id: adminId,
					status: 'ANSWERED', // Устанавливаем статус как 'ANSWERED'
				}

				await updateTicket(updatedTicket as unknown as Ticket)

				// Отправка email пользователю
				await fetch('/api/tickets/email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userEmail: ticket.email, // Email пользователя
						userName: ticket.user_name, // Имя пользователя
						adminReply, // Ответ администратора
					}),
				})

				setTickets(
					tickets.map(t =>
						t.id === ticket.id ? (updatedTicket as unknown as Ticket) : t
					)
				)
				toast.success('Ответ отправлен')
				handleModalClose()
			} catch (error) {
				toast.error('Ошибка при отправке ответа')
			}
		}
	}

	// Функция для открытия модального окна
	const handleModalOpen = (ticket: Ticket) => {
		setCurrentTicket(ticket)
		setAdminReply('')
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setCurrentTicket(null)
		setAdminReply('')
	}

	// Функция для удаления тикета
	const handleRemoveTicket = async (id: number) => {
		try {
			await removeTicket(id)
			setTickets(tickets.filter(ticket => ticket.id !== id))
			toast.success('Тикет успешно удален')
		} catch (error) {
			toast.error('Ошибка при удалении тикета')
		}
	}

	const statusColors: Record<string, string> = {
		PENDING: `badge ${styles.badge_warning}`,
		ANSWERED: `badge ${styles.badge_success}`,
	}

	const statusTranslations: Record<string, { label: string; icon: string }> = {
		PENDING: { label: 'Требует ответа', icon: 'bi bi-clock me-2' },
		ANSWERED: { label: 'Отвечен', icon: 'bi bi-check-circle me-2' },
	}

	return (
		<div>
			<h2>Система поддержки</h2>

			{loading ? (
				<Alert
					variant='primary'
					className=' d-flex text-center justify-content-center align-items-center'
				>
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</div>
				</Alert>
			) : noTickets ? (
				<Alert variant='danger' className='text-center'>
					Тикеты не найдены 😞
				</Alert>
			) : (
				<div className={styles.table_container}>
					<div
						className={styles.table_container_responsive}
						style={{
							maxWidth: '100vw',
							overflowY: 'auto',
						}}
					>
						<Table striped bordered hover responsive className='mt-3'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Статус</th>
									<th>Имя пользователя</th>
									<th>Email</th>
									<th>Тема вопроса</th>
									<th>Вопрос</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{tickets.map((ticket: any) => (
									<tr key={ticket.id}>
										<td>{ticket.id}</td>
										<td>
											<span className={statusColors[ticket.status || '']}>
												<i
													className={
														statusTranslations[ticket.status || ''].icon
													}
												></i>
												{statusTranslations[ticket.status || ''].label}
											</span>
										</td>
										<td>{ticket.user_name}</td>
										<td>{ticket.email}</td>
										<td>{ticket.question_theme}</td>
										<td>{ticket.question}</td>
										<td>
											<ButtonGroup>
												<Button
													variant='success'
													disabled={ticket.status === 'ANSWERED'}
													onClick={() => handleModalOpen(ticket)}
												>
													Ответить
												</Button>
												<Button
													variant='danger'
													onClick={() => handleRemoveTicket(ticket.id!)} // Используем ! для указания, что id не null
												>
													<i className='bi bi-trash'></i>
												</Button>
											</ButtonGroup>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				</div>
			)}

			{/* Модальное окно для ответа на тикет */}
			<Modal show={showModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Ответить на тикет</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Имя пользователя</Form.Label>
							<Form.Control
								type='text'
								value={currentTicket?.user_name || ''}
								disabled
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Тема вопроса</Form.Label>
							<Form.Control
								type='text'
								value={currentTicket?.question_theme || ''}
								disabled
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Вопрос</Form.Label>
							<Form.Control
								as='textarea'
								value={currentTicket?.question || ''}
								disabled
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Ответ</Form.Label>
							<Form.Control
								as='textarea'
								value={adminReply}
								onChange={e => setAdminReply(e.target.value)}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleModalClose}>
						Отмена
					</Button>
					<Button
						variant='primary'
						onClick={() => currentTicket && handleUpdateReply(currentTicket)}
					>
						Отправить ответ
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Support
