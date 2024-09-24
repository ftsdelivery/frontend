import { User } from '@/types/user.types'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './../Orders/Orders.module.css'

interface UserModalProps {
	show: boolean
	user: User | null
	onHide: () => void
	onSave: (id: number, user: User) => void
}

const UserModal: React.FC<UserModalProps> = ({
	show,
	user,
	onHide,
	onSave,
}) => {
	const [formData, setFormData] = useState<User>(
		user || { id: 0, name: '', email: '', role: '', used_promocodes: [] }
	)
	const [promoCodesArray, setPromoCodesArray] = useState<string[]>([])
	const [hoveredCode, setHoveredCode] = useState<string | null>(null)

	useEffect(() => {
		let parsedPromoCodes: string[] = []

		if (typeof formData.used_promocodes === 'string') {
			try {
				parsedPromoCodes = JSON.parse(formData.used_promocodes)
			} catch (e) {}
		} else if (Array.isArray(formData.used_promocodes)) {
			parsedPromoCodes = formData.used_promocodes
		}

		setPromoCodesArray(parsedPromoCodes)
	}, [formData.used_promocodes])

	const handleChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = event.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSave = () => {
		if (user) {
			const updatedUser: User = {
				...formData,
				used_promocodes: JSON.stringify(promoCodesArray),
			}
			onSave(user.id || 0, updatedUser)
		}
	}

	const handleDeletePromoCode = (code: string) => {
		const updatedCodes = promoCodesArray.filter(c => c !== code)
		setPromoCodesArray(updatedCodes)
		setFormData(prevData => ({
			...prevData,
			used_promo_codes: JSON.stringify(updatedCodes),
		}))
	}

	const promoCodeSpans =
		promoCodesArray.length > 0 ? (
			<div
				style={{
					border: '1px solid #ccc',
					padding: '5px',
					borderRadius: '5px',
					display: 'flex',
					flexWrap: 'wrap',
				}}
			>
				{promoCodesArray.map((code, index) => (
					<span
						key={index}
						className={`badge ${styles.badge_gray} me-1 position-relative`}
						onMouseEnter={() => setHoveredCode(code)}
						onMouseLeave={() => setHoveredCode(null)}
					>
						<span className='bi bi-tags me-1'></span>
						{code}
						{hoveredCode === code && (
							<span
								className='position-absolute top-0 end-15 ms-2 translate-middle badge rounded-pill bg-danger'
								style={{ cursor: 'pointer' }}
								onClick={() => handleDeletePromoCode(code)}
							>
								&times;
							</span>
						)}
					</span>
				))}
			</div>
		) : (
			<div
				style={{
					border: '1px solid #ccc',
					padding: '5px',
					borderRadius: '5px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				Нет использованных промокодов
			</div>
		)

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{user ? 'Редактировать пользователя' : 'Создать пользователя'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className='mb-3' controlId='formUserName'>
						<Form.Label>Имя</Form.Label>
						<Form.Control
							type='text'
							name='name'
							value={formData.name || ''}
							onChange={handleChange}
							placeholder='Введите имя'
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='formUserEmail'>
						<Form.Label>Почта</Form.Label>
						<Form.Control
							type='email'
							name='email'
							value={formData.email || ''}
							onChange={handleChange}
							placeholder='Введите email'
						/>
					</Form.Group>
					<Form.Group controlId='formUserRole'>
						<Form.Label>Роль</Form.Label>
						<Form.Control
							as='select'
							name='role'
							value={formData.role || ''}
							onChange={handleChange}
						>
							<option value='ADMINISTRATOR'>Администратор</option>
							<option value='USER'>Пользователь</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='formUserUsedPromoCodes'>
						<Form.Label>
							<div className='mt-2'>Использованные промокоды</div>
						</Form.Label>
						<div>{promoCodeSpans}</div>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					className={`${styles.btn_secondary}`}
					size='sm'
					onClick={onHide}
				>
					Отмена
				</Button>
				<Button
					variant='primary'
					className={`${styles.btn_sucess}`}
					size='sm'
					onClick={handleSave}
				>
					Сохранить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default UserModal
