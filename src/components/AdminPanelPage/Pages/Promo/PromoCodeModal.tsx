import { PromoCode } from '@/types/promocode.types'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './../Orders/Orders.module.css'

interface PromoCodeModalProps {
	show: boolean
	onHide: () => void
	promoCode: PromoCode | null
	onSave: (promoCode: PromoCode) => void
}

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
	show,
	onHide,
	promoCode,
	onSave,
}) => {
	const [formData, setFormData] = useState<PromoCode>({
		id: promoCode?.id || 0,
		code: promoCode?.code || '',
		discount: promoCode?.discount || 0,
		count_of_uses: promoCode?.count_of_uses || 0,
		limit_of_uses: promoCode?.limit_of_uses || 0,
		is_active: promoCode?.is_active || true,
		author_id: promoCode?.author_id || 0,
	})

	useEffect(() => {
		if (promoCode) {
			setFormData(promoCode)
		}
	}, [promoCode])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => (prev ? { ...prev, [name]: value } : prev))
	}

	const handleSave = () => {
		if (formData) {
			onSave(formData)
		}
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{promoCode?.code ? 'Редактировать промокод' : 'Добавить промокод'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId='formStatusPromo'>
						<Form.Label>Статус</Form.Label>
						<Form.Control
							as='select'
							name='is_active'
							value={formData?.is_active?.toString() || 'true'}
							onChange={handleChange}
						>
							<option value='true'>Активен</option>
							<option value='false'>Неактивен</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='formCode'>
						<Form.Label>Промокод</Form.Label>
						<Form.Control
							type='text'
							name='code'
							value={formData.code}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<Form.Group controlId='formDiscount'>
						<Form.Label>Скидка (%)</Form.Label>
						<Form.Control
							type='number'
							name='discount'
							value={formData.discount}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<Form.Group controlId='formLimitOfUses'>
						<Form.Label>Лимит использований</Form.Label>
						<Form.Control
							type='number'
							name='limit_of_uses'
							value={formData.limit_of_uses}
							onChange={handleChange}
						/>
					</Form.Group>
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
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default PromoCodeModal
