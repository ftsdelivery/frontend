import { Order } from '@/types/order.types'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './Orders.module.css'

interface OrderModalProps {
	show: boolean
	order: Order | null
	onHide: () => void
	onSave: (id: number, order: Order) => void
}

const OrderModal: React.FC<OrderModalProps> = ({
	show,
	order,
	onHide,
	onSave,
}) => {
	const [editedOrder, setEditedOrder] = useState<Order>(order || ({} as Order))
	const [selectedServices, setSelectedServices] = useState<string[]>([])

	useEffect(() => {
		if (order) {
			const services = order.extra_services
				? order.extra_services.split(',').map(service => service.trim())
				: []
			if (services.includes('Без доп. услуг') && services.length > 1) {
				setSelectedServices(
					services.filter(service => service !== 'Без доп. услуг')
				)
			} else {
				setSelectedServices(services)
			}
			setEditedOrder(prevOrder => ({
				...prevOrder,
				...order,
			}))
		}
	}, [order])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target
		setEditedOrder(prevOrder => ({ ...prevOrder, [name]: value }))
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target
		setSelectedServices(prevServices => {
			const updatedServices = new Set(prevServices)
			if (checked) {
				if (updatedServices.has('Без доп. услуг')) {
					updatedServices.delete('Без доп. услуг')
				}
				updatedServices.add(value)
			} else {
				updatedServices.delete(value)
				if (updatedServices.size === 0) {
					updatedServices.add('Без доп. услуг')
				}
			}
			return Array.from(updatedServices)
		})
	}

	const handleSubmit = () => {
		const finalServices =
			selectedServices.length > 0 ? selectedServices : ['Без доп. услуг']
		const updatedOrder = {
			...editedOrder,
			extra_services: finalServices.join(','),
		}
		if (order) {
			onSave(order.id!, updatedOrder)
		}
		onHide()
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{order ? 'Редактирование заявки' : 'Создание заявки'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId='formstatus'>
						<Form.Label>Статус</Form.Label>
						<Form.Control
							as='select'
							name='status'
							value={editedOrder.status || ''}
							onChange={handleChange}
						>
							<option value='PENDING'>В ожидании</option>
							<option value='CONFIRMED'>Подверждено</option>
							<option value='DELIVERED'>Доставлено</option>
							<option value='CANCELED'>Отменено</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='formIp'>
						<Form.Label>ИП</Form.Label>
						<Form.Control
							type='text'
							name='ip'
							value={editedOrder.ip || ''}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='formmarket_place'>
						<Form.Label>Маркетплейс</Form.Label>
						<Form.Control
							as='select'
							name='marketplace'
							value={editedOrder.marketplace || ''}
							onChange={handleChange}
						>
							<option value='Яндекс Маркет'>Яндекс Маркет</option>
							<option value='Ozon'>Ozon</option>
							<option value='Wildberries'>Wildberries</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='formdelivery_type'>
						<Form.Label>Тип доставки</Form.Label>
						<Form.Control
							as='select'
							name='delivery_type'
							value={editedOrder.delivery_type || ''}
							onChange={handleChange}
						>
							<option value='Паллеты'>Паллеты</option>
							<option value='Коробки'>Коробки</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='formquanity'>
						<Form.Label>Количество</Form.Label>
						<Form.Control
							type='text'
							name='quantity'
							value={editedOrder.quantity || ''}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='formextra_services'>
						<Form.Label>Доп. услуги</Form.Label>
						<Form.Check
							type='checkbox'
							value='Паллет'
							label='Паллет'
							checked={selectedServices.includes('Паллет')}
							onChange={handleCheckboxChange}
						/>
						<Form.Check
							type='checkbox'
							value='Паллетирование'
							label='Паллетирование'
							checked={selectedServices.includes('Паллетирование')}
							onChange={handleCheckboxChange}
						/>
						<Form.Check
							type='checkbox'
							value='Погрузка'
							label='Погрузка'
							checked={selectedServices.includes('Погрузка')}
							onChange={handleCheckboxChange}
						/>
					</Form.Group>
					<Form.Group controlId='formpickup_address'>
						<Form.Label>Адрес забора</Form.Label>
						<Form.Control
							type='text'
							name='pickup_address'
							value={editedOrder.pickup_address || ''}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='formcomment'>
						<Form.Label>Комментарий</Form.Label>
						<Form.Control
							type='text'
							name='comment'
							value={editedOrder.comment || ''}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='formorder_price'>
						<Form.Label>Предварительная стоимость</Form.Label>
						<Form.Control
							type='text'
							name='price'
							value={editedOrder.price || ''}
							onChange={handleChange}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					className={`${styles.btn_secondary}`}
					onClick={onHide}
				>
					Закрыть
				</Button>
				<Button
					variant='primary'
					className={`${styles.btn_sucess}`}
					onClick={handleSubmit}
					size='sm'
				>
					Сохранить изменения
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default OrderModal
