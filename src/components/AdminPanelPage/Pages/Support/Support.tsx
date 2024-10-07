'use client'

import {
	getTickets,
	removeTicket,
	updateTicket,
} from '@/services/ticket.service'
import { Status, Ticket } from '@/types/ticket.types'
import { playSuccessSound } from '@/utils/SoundEffects'
import { getSession } from 'next-auth/react'
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
	const [showAnswered, setShowAnswered] = useState(true)
	const [filterTheme, setFilterTheme] = useState<string | null>(null)
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

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

	const handleUpdateReply = async (ticket: Ticket) => {
		if (adminReply) {
			try {
				const session = await getSession()
				const adminId = Number(session?.user?.id)

				const updatedTicket = {
					...ticket,
					admin_reply: adminReply,
					admin_id: adminId,
					status: 'ANSWERED',
				}

				await updateTicket(updatedTicket as unknown as Ticket)

				await fetch('/api/tickets/email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userEmail: ticket.email,
						userName: ticket.user_name,
						adminReply,
					}),
				})

				setTickets(
					tickets.map(t =>
						t.id === ticket.id ? (updatedTicket as unknown as Ticket) : t
					)
				)
				toast.success('Ответ успешно отправлен')
				playSuccessSound()
				handleModalClose()
			} catch (error) {
				toast.error('Ошибка при отправке ответа')
			}
		}
	}

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

	const handleReset = () => {
		setFilterTheme(null)
		setShowFilterModal(false)
	}

	const handleRemoveTicket = async (id: number) => {
		try {
			await removeTicket(id)
			setTickets(tickets.filter(ticket => ticket.id !== id))
			toast.success('Тикет успешно удален')
			playSuccessSound()
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

	const ticketThemes = [
		'Общие вопросы',
		'Техническая поддержка',
		'Оплата',
		'Возврат',
		'Другое',
	]

	const handleApplyFilter = () => {
		setFilterTheme(selectedTheme) // Применяем фильтр по выбранной теме
		setShowFilterModal(false)
	}

	const sortedTickets = tickets
		.filter(ticket => showAnswered || ticket.status !== Status.ANSWERED) // Фильтрация отвеченных тикетов
		.filter(ticket => !filterTheme || ticket.question_theme === filterTheme) // Фильтрация по теме
		.sort((a, b) => {
			if (a.status === Status.PENDING && b.status !== Status.PENDING) return -1
			if (a.status !== Status.PENDING && b.status === Status.PENDING) return 1
			if (a.status === undefined && b.status !== undefined) return 1
			if (a.status !== undefined && b.status === undefined) return -1
			return 0 // Если оба статуса равны
		})

	return (
		<div>
			<h2>Система поддержки</h2>
			<ButtonGroup className='mb-3'>
				<Button
					variant='primary'
					title='Обновить'
					onClick={fetchTickets}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-arrow-clockwise'></i>
				</Button>
				<Button
					variant='primary'
					title='Фильтр'
					onClick={() => setShowFilterModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-funnel'></i>
				</Button>
				<Button
					variant='secondary'
					onClick={() => setShowAnswered(!showAnswered)}
				>
					{showAnswered ? (
						<>
							<i className='bi bi-eye-slash'></i> Не показывать отвеченные
						</>
					) : (
						<>
							<i className='bi bi-eye'></i> Показать отвеченные
						</>
					)}
				</Button>
			</ButtonGroup>

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
								{sortedTickets.map((ticket: any) => (
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
													<i className='bi bi-chat-dots'></i>
													{''} Ответить
												</Button>
												<Button
													variant='danger'
													onClick={() => handleRemoveTicket(ticket.id!)}
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

			{/* Модальное окно для фильтрации тикетов */}
			<Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Фильтр по темам</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group controlId='filterTheme'>
						<Form.Label>Выберите тему</Form.Label>
						<Form.Control
							as='select'
							value={selectedTheme || ''}
							onChange={e => setSelectedTheme(e.target.value || null)} // Обновляем локальную переменную, а не состояние
						>
							<option value=''>Все темы</option>
							{ticketThemes.map(theme => (
								<option key={theme} value={theme}>
									{theme}
								</option>
							))}
						</Form.Control>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant='outline-danger'
						className={`${styles.btn_danger_outline}`}
						size='sm'
						onClick={handleReset}
					>
						Сбросить
					</Button>
					<Button variant='secondary' onClick={() => setShowFilterModal(false)}>
						Закрыть
					</Button>
					<Button variant='primary' onClick={handleApplyFilter}>
						Применить
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Support
