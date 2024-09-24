import { getUser } from '@/services/user.service'
import { User } from '@/types/user.types'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './Orders.module.css'

interface UserModalProps {
	show: boolean
	user: User | number | null
	onHide: () => void
}

const RoleColors: Record<string, string> = {
	ADMIN: `badge ${styles.badge_danger}`,
	USER: `badge ${styles.badge_primary}`,
}

const RoleTranslations: Record<string, string> = {
	ADMIN: 'Администратор',
	USER: 'Пользователь',
}

const UserModal: React.FC<UserModalProps> = ({ show, user, onHide }: any) => {
	const [formData, setFormData] = useState<User | null>(null)

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const fetchedUser = await getUser(user.id)
				setFormData(fetchedUser.data)
			} catch (error) {
				console.error('Failed to fetch user data:', error)
				setFormData(null)
			}
		}

		fetchUserData()
	}, [user])

	let promoCodesArray: string[] = []

	if (typeof formData?.used_promocodes === 'string') {
		try {
			promoCodesArray = JSON.parse(formData?.used_promocodes)
		} catch (e) {
			console.error('Ошибка разбора промокодов:', e)
		}
	} else if (Array.isArray(formData?.used_promocodes)) {
		promoCodesArray = formData?.used_promocodes
	}

	const promoCodeSpans =
		promoCodesArray.length > 0
			? promoCodesArray.map((code, index) => (
					<span key={index} className='badge bg-secondary me-1'>
						{code}
					</span>
			  ))
			: 'Нет использованных промокодов'

	return (
		<Modal show={show} onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Просмотр пользователя</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{formData ? (
					<Form>
						<Form.Group className='mb-3' controlId='formUserName'>
							<Form.Label>Имя</Form.Label>
							<Form.Control
								type='text'
								name='name'
								value={formData.name}
								readOnly
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='formUserEmail'>
							<Form.Label>Почта</Form.Label>
							<Form.Control
								type='email'
								name='email'
								value={formData.email}
								readOnly
							/>
						</Form.Group>
						<Form.Group controlId='formUserRole'>
							<Form.Label>Роль</Form.Label>
							<div>
								<span
									className={`badge ${
										RoleColors[formData.role as keyof typeof RoleColors]
									}`}
								>
									{
										RoleTranslations[
											formData.role as keyof typeof RoleTranslations
										]
									}
								</span>
							</div>
						</Form.Group>
						<Form.Group controlId='formUserUsedPromoCodes'>
							<Form.Label>
								<div className='mt-3'>Использованные промокоды</div>
							</Form.Label>
							<div>{promoCodeSpans}</div>
						</Form.Group>
					</Form>
				) : (
					<p>Пользователь не найден.</p>
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

export default UserModal
