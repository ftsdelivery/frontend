import {
	createPromoCode,
	deletePromoCode,
	getPromoCodes,
	updatePromoCode,
} from '@/services/promocodes.service'
import { PromoCode } from '@/types/promocode.types'
import { playSuccessSound } from '@/utils/SoundEffects'
import { getSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form, Table } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { toast } from 'sonner'
import styles from './../Orders/Orders.module.css'
import ConfirmDeletePromoCodeModal from './ConfirmDeletePromoCodeModal'
import PromoCodeModal from './PromoCodeModal'

const PromoCodes: React.FC = () => {
	const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showPromoCodeModal, setShowPromoCodeModal] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(50)
	const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
		null
	)

	const statusTranslations: Record<string, { label: string; icon: string }> = {
		ACTIVE: { label: 'Активен', icon: 'bi bi-check-circle' },
		INACTIVE: { label: 'Неактивен', icon: 'bi bi-x-circle' },
	}

	const fetchPromoCodesData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getPromoCodes()
			setPromoCodes(response.data)
		} catch (error) {
			console.error('Ошибка при получении промокодов:', error)
			setError('Ошибка при получении промокодов')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchPromoCodesData()
	}, [fetchPromoCodesData])

	const handleEdit = (promoCode: PromoCode) => {
		setSelectedPromoCode(promoCode)
		setShowPromoCodeModal(true)
	}

	const handleSave = async (promoCode: PromoCode) => {
		try {
			if (promoCode.id) {
				await updatePromoCode(promoCode.id, promoCode)
				toast.success('Промокод успешно обновлен')
				playSuccessSound()
			} else {
				const session = await getSession()
				const UserId = session?.user.id
				promoCode.count_of_uses = 0
				promoCode.author_id = parseInt(UserId as string) || 0
				promoCode.discount = promoCode.discount || 0
				promoCode.limit_of_uses = promoCode.limit_of_uses || 0
				promoCode.is_active = promoCode.is_active || true

				await createPromoCode(promoCode)
				toast.success('Промокод успешно добавлен')
				playSuccessSound()
			}
			fetchPromoCodesData()
		} catch (error) {
			console.error('Ошибка при сохранении промокода:', error)
			toast.error('Ошибка при сохранении промокода')
		} finally {
			setShowPromoCodeModal(false)
			setSelectedPromoCode(null)
		}
	}

	const handleDelete = (promoCode: PromoCode) => {
		setSelectedPromoCode(promoCode)
		setShowDeleteModal(true)
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value))
		setCurrentPage(1)
	}

	const confirmDelete = async () => {
		if (selectedPromoCode) {
			try {
				await deletePromoCode(selectedPromoCode.id!)
				toast.success('Промокод успешно удален')
				playSuccessSound()
				fetchPromoCodesData()
			} catch (error) {
				console.error('Ошибка при удалении промокода:', error)
				toast.error('Ошибка при удалении промокода')
			} finally {
				setShowDeleteModal(false)
				setSelectedPromoCode(null)
			}
		}
	}

	return (
		<div>
			<ButtonGroup className='mb-3'>
				<Button
					variant='success'
					title='Создать промокод'
					onClick={() => handleEdit({} as PromoCode)}
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-plus-lg'></i>
				</Button>
				<Button
					variant='primary'
					title='Обновить'
					onClick={fetchPromoCodesData}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-arrow-clockwise'></i>
				</Button>
				<Form.Select
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
					size='sm'
					title='Количество промокодов на странице'
				>
					<option value={10}>10</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
					<option value={500}>500</option>
					<option value={1000}>1000</option>
				</Form.Select>
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
			) : error ? (
				<Alert variant='error' className='text-center'>
					{error}
				</Alert>
			) : promoCodes.length === 0 ? (
				<Alert variant='error' className='text-center'>
					Промокоды не найдены 😞
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
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>ID</th>
									<th>Статус</th>
									<th>Промокод</th>
									<th>Автор</th>
									<th>Скидка</th>
									<th>Количество использований</th>
									<th>Лимит использования</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{promoCodes.map(promoCode => (
									<tr key={promoCode.id}>
										<td>{promoCode.id}</td>
										<td>
											<span
												className={`badge ${
													promoCode.is_active
														? `${styles.badge_success}`
														: `${styles.badge_danger}`
												}`}
											>
												<i
													className={
														statusTranslations[
															promoCode.is_active ? 'ACTIVE' : 'INACTIVE'
														].icon
													}
													style={{ marginRight: 4 }}
												></i>
												{
													statusTranslations[
														promoCode.is_active ? 'ACTIVE' : 'INACTIVE'
													].label
												}
											</span>
										</td>
										<td>{promoCode.code}</td>
										<td>{promoCode.author_id}</td>
										<td>
											<span className={`badge ${styles.badge_primary}`}>
												-{promoCode.discount}%
											</span>
										</td>
										<td>{promoCode.count_of_uses}</td>
										<td>{promoCode.limit_of_uses}</td>
										<td>
											<ButtonGroup>
												<Button
													variant='warning'
													title='Редактировать'
													onClick={() => handleEdit(promoCode)}
												>
													<i className='bi bi-pencil-square'></i>
												</Button>
												<Button
													variant='danger'
													title='Удалить'
													onClick={() => handleDelete(promoCode)}
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

			{showDeleteModal && selectedPromoCode && (
				<ConfirmDeletePromoCodeModal
					show={showDeleteModal}
					onHide={() => setShowDeleteModal(false)}
					onConfirm={confirmDelete}
				/>
			)}

			{showPromoCodeModal && selectedPromoCode && (
				<PromoCodeModal
					show={showPromoCodeModal}
					onHide={() => setShowPromoCodeModal(false)}
					promoCode={selectedPromoCode}
					onSave={handleSave}
				/>
			)}

			<ToastContainer />
		</div>
	)
}

export default PromoCodes
