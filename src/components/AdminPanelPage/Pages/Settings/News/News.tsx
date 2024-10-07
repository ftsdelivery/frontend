import {
	addNews,
	getAllNews,
	removeNews,
	updateNews,
} from '@/services/news.service' // Assuming you have news services set up
import type { News } from '@/types/news.types' // Assuming you have news types set up
import { playSuccessSound } from '@/utils/SoundEffects'
import { useCallback, useEffect, useState } from 'react'
import {
	Alert,
	Button,
	ButtonGroup,
	Form,
	Modal,
	OverlayTrigger,
	Table,
	Tooltip,
} from 'react-bootstrap'
import { toast } from 'sonner'
import styles from './../../Orders/Orders.module.css'

const NewsManagement = () => {
	const [newsItems, setNewsItems] = useState<News[]>([])
	const [showModal, setShowModal] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [currentNews, setCurrentNews] = useState<News | null>(null)
	const [newNews, setNewNews] = useState({
		image: '',
		title: '',
		content: '',
	})
	const [loading, setLoading] = useState(true)
	const [noNews, setNoNews] = useState(false)

	const fetchNews = useCallback(async () => {
		setLoading(true)
		try {
			const data = await getAllNews()
			if (data.data.length === 0) {
				setNoNews(true)
			} else {
				setNoNews(false)
				setNewsItems(data.data)
			}
		} catch (error) {
			setNoNews(true)
			setNewsItems([])
		} finally {
			setLoading(false)
		}
	}, [])

	const renderImageLink = (imageUrl: string) => (
		<OverlayTrigger
			placement='top'
			overlay={<Tooltip id={`tooltip-${imageUrl}`}>{imageUrl}</Tooltip>}
		>
			<Button variant='link' href={imageUrl} target='_blank'>
				<i className='bi bi-link-45deg'></i> Ссылка
			</Button>
		</OverlayTrigger>
	)

	useEffect(() => {
		fetchNews()
	}, [fetchNews])

	const handleAddNewsClick = () => {
		setIsEditing(false)
		setNewNews({ title: '', content: '', image: '' })
		setShowModal(true)
	}

	const handleEditNewsClick = (news: News) => {
		setIsEditing(true)
		setCurrentNews(news)
		setNewNews({
			title: news.title || '',
			content: news.content || '',
			image: news.image || '',
		})
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setNewNews({ title: '', content: '', image: '' })
		setCurrentNews(null)
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setNewNews(prev => ({ ...prev, [name]: value }))
	}

	const handleSaveNews = async () => {
		try {
			if (isEditing && currentNews) {
				if (currentNews.id !== undefined) {
					await updateNews(
						currentNews.id,
						newNews.image,
						newNews.title,
						newNews.content
					)
				} else {
					throw new Error('Current news ID is undefined')
				}
				setNewsItems(
					newsItems.map(n =>
						n.id === currentNews.id
							? {
									...n,
									image: newNews.image,
									title: newNews.title,
									content: newNews.content,
							  }
							: n
					)
				)
				toast.success('Новость успешно обновлена')
				playSuccessSound()
				fetchNews()
			} else {
				const newN = await addNews(
					newNews.image,
					newNews.title,
					newNews.content
				)
				setNewsItems([...newsItems, newN.data])
				toast.success('Новость успешно добавлена')
				playSuccessSound()
				fetchNews()
			}
			handleModalClose()
		} catch (error) {
			console.error('Ошибка при сохранении новости:', error)
			toast.error('Ошибка при сохранении новости')
		} finally {
			setNewNews({ title: '', content: '', image: '' })
			setCurrentNews(null)
		}
	}

	const handleRemoveNews = async (id: number) => {
		try {
			await removeNews(id)
			toast.success('Новость успешно удалена')
			playSuccessSound()
			setNewsItems(newsItems.filter(n => n.id !== id))
			fetchNews()
		} catch (error) {
			toast.error('Ошибка при удалении новости')
			console.error('Ошибка при удалении новости:', error)
		}
	}

	return (
		<div>
			<div className='col'>
				<h2>Управление новостями</h2>
				<Button
					variant='success'
					onClick={handleAddNewsClick}
					title='Добавить новость'
					size='sm'
					className={`m-1 ${styles.btn_warning}`}
				>
					<i className='bi bi-plus-lg me-2'></i>
					Добавить новость
				</Button>
			</div>

			<div className={styles.table_container}>
				<div
					className={styles.table_container_responsive}
					style={{ maxWidth: '100vw', overflowY: 'auto' }}
				>
					{loading ? (
						<Alert
							variant='primary'
							className='d-flex text-center justify-content-center align-items-center mt-3'
						>
							<div className='d-flex justify-content-center'>
								<div className='spinner-border' role='status'>
									<span className='visually-hidden'>Загрузка...</span>
								</div>
							</div>
						</Alert>
					) : noNews ? (
						<Alert
							variant='danger'
							className='mt-3 d-flex align-items-center justify-content-center'
						>
							😞 Новости отсутствуют
						</Alert>
					) : (
						<Table striped bordered hover responsive className='mt-3'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Заголовок</th>
									<th>Содержание</th>
									<th>Изображение</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{newsItems.map(n => (
									<tr key={n.id}>
										<td>{n.id}</td>
										<td>{n.title}</td>
										<td>{n.content}</td>
										<td>
											<Button
												variant='dark'
												className='badge bg-dark text-wrap'
												as='a'
												href={n.image}
												target='_blank'
											>
												<i className='bi bi-link-45deg'></i> Ссылка
											</Button>
										</td>
										<td>
											<ButtonGroup>
												<Button
													variant='warning'
													onClick={() => handleEditNewsClick(n)}
													className={styles.btn_warning}
												>
													<i className='bi bi-pencil-square'></i>
												</Button>
												<Button
													variant='danger'
													onClick={() =>
														n.id !== undefined && handleRemoveNews(n.id)
													}
													className={styles.btn_danger}
												>
													<i className='bi bi-trash'></i>
												</Button>
											</ButtonGroup>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</div>
			</div>

			{/* Modal */}
			<Modal show={showModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						{isEditing ? 'Редактировать новость' : 'Добавить новость'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newsImage'>
							<Form.Label>Изображение</Form.Label>
							<Form.Control
								type='text'
								name='image'
								value={newNews.image}
								onChange={handleInputChange}
								placeholder='Введите URL изображения'
							/>
						</Form.Group>
					</Form>
					<Form>
						<Form.Group className='mb-3' controlId='newsTitle'>
							<Form.Label>Заголовок</Form.Label>
							<Form.Control
								type='text'
								name='title'
								value={newNews.title}
								onChange={handleInputChange}
								placeholder='Введите заголовок новости'
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='newsContent'>
							<Form.Label>Содержание</Form.Label>
							<Form.Control
								as='textarea'
								name='content'
								value={newNews.content}
								onChange={handleInputChange}
								placeholder='Введите содержание новости'
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleModalClose}>
						Отмена
					</Button>
					<Button variant='primary' onClick={handleSaveNews}>
						{isEditing ? 'Сохранить изменения' : 'Сохранить'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default NewsManagement
