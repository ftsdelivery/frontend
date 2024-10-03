import { getWarehouses } from '@/services/warehouses.service'
import { Order } from '@/types/order.types'
import { Warehouse } from '@/types/warehouse.types'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { toast } from 'sonner'
import styles from './Orders.module.css'

interface CreateOrderModalProps {
	show: boolean
	onHide: () => void
	onSave: (order: Order) => void
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
	show,
	onHide,
	onSave,
}) => {
	const [newOrder, setNewOrder] = useState<Order>({
		marketplace: 'Яндекс Маркет',
		delivery_type: 'Паллеты',
	} as Order)
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [availableWarehouses, setAvailableWarehouses] = useState<
		{ id: number; name: string; description: string }[]
	>([])
	const [validated, setValidated] = useState(false)
	const [warehousesOzon, setWarehousesOzon] = useState<Warehouse[]>([])
	const [warehousesYandex, setWarehousesYandex] = useState<Warehouse[]>([])
	const [warehousesWildberries, setWarehousesWildberries] = useState<
		Warehouse[]
	>([])
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target
		setNewOrder(prevOrder => ({ ...prevOrder, [name]: value }))
	}

	const warehouses: Record<
		string,
		{ id: number; name: string; description: string }[]
	> = {
		'Яндекс Маркет': warehousesYandex,
		Ozon: warehousesOzon,
		Wildberries: warehousesWildberries,
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

	useEffect(() => {
		const fetchWarehouses = async () => {
			try {
				const ozonWarehouses = await getWarehouses(1) // Используйте правильный ID для Ozon
				const yandexWarehouses = await getWarehouses(2) // Используйте правильный ID для Яндекс Маркет
				const wildberriesWarehouses = await getWarehouses(3) // Используйте правильный ID для Wildberries

				setWarehousesOzon(ozonWarehouses.data)
				setWarehousesYandex(yandexWarehouses.data)
				setWarehousesWildberries(wildberriesWarehouses.data)
			} catch (error) {
				console.error('Ошибка при загрузке складов:', error)
			}
		}

		fetchWarehouses()
	}, [])

	useEffect(() => {
		if (newOrder.marketplace) {
			setAvailableWarehouses(warehouses[newOrder.marketplace] || [])
		} else {
			setAvailableWarehouses([])
		}
	}, [newOrder.marketplace])

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const form = event.currentTarget
		if (form.checkValidity() === false) {
			event.preventDefault()
			event.stopPropagation()
			toast.error('Пожалуйста, заполните все обязательные поля.')
		} else {
			const finalServices =
				selectedServices.length > 0 ? selectedServices : ['Без доп. услуг']
			const updatedOrder = {
				...newOrder,
				extra_services: finalServices.join(','),
			}
			onSave(updatedOrder)
			onHide()
		}

		setValidated(true)
	}

	return (
		<div>
			<Modal show={show} onHide={onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Создание новой заявки</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate validated={validated} onSubmit={handleSubmit}>
						<Form.Group controlId='formip'>
							<Form.Label>ИП</Form.Label>
							<Form.Control
								type='text'
								name='ip'
								value={newOrder.ip || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='filterMarketPlace'>
							<Form.Label>Маркетплейс</Form.Label>
							<Form.Control
								as='select'
								name='marketplace'
								value={newOrder.marketplace || ''}
								onChange={handleChange}
								required
							>
								<option value='Яндекс Маркет'>Яндекс Маркет</option>
								<option value='Ozon'>Ozon</option>
								<option value='Wildberries'>Wildberries</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId='filterWarehouse'>
							<Form.Label>Склад</Form.Label>
							<Form.Control
								as='select'
								name='warehouse'
								value={newOrder.warehouse || ''}
								onChange={handleChange}
								disabled={!newOrder.marketplace}
								required
							>
								<option value=''>Выберите склад</option>
								{availableWarehouses.map(warehouse => (
									<option key={warehouse.id} value={warehouse.id}>
										{warehouse.name} - {warehouse.description}
									</option>
								))}
							</Form.Control>
						</Form.Group>
						<Form.Group controlId='formdelivery_type'>
							<Form.Label>Тип доставки</Form.Label>
							<Form.Control
								as='select'
								name='delivery_type'
								value={newOrder.delivery_type || ''}
								onChange={handleChange}
								required
							>
								<option value='Паллеты'>Паллеты</option>
								<option value='Коробки'>Коробки</option>
							</Form.Control>
						</Form.Group>
						<Form.Group controlId='formquantity'>
							<Form.Label>Количество</Form.Label>
							<Form.Control
								type='number'
								name='quantity'
								value={newOrder.quantity || ''}
								onChange={handleChange}
								required
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
						<Form.Group controlId='formbox_weight'>
							<Form.Label>Вес короба</Form.Label>
							<Form.Control
								type='text'
								name='box_weight'
								value={newOrder.box_weight || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='formbox_weight'>
							<Form.Label>Размер короба</Form.Label>
							<Form.Control
								as='select'
								name='box_size'
								value={newOrder.box_size || ''}
								onChange={handleChange}
								required
							>
								<option value='Маленький (30x20x20)'>
									Маленький (30x20x20)
								</option>
								<option value='Стандартный (60x40x40)'>
									Стандартный (60x40x40)
								</option>
								<option value='Максимальный (120x80x40)'>
									Максимальный (120x80x40)
								</option>
							</Form.Control>
						</Form.Group>
						<Form.Group controlId='formpickup_date'>
							<Form.Label>Дата забора</Form.Label>
							<Form.Control
								type='date'
								name='pickup_date'
								value={newOrder.pickup_date || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='formpickup_time'>
							<Form.Label>Время забора</Form.Label>
							<Form.Control
								type='time'
								name='pickup_time'
								value={newOrder.pickup_time || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='formpickup_address'>
							<Form.Label>Адрес забора</Form.Label>
							<Form.Control
								type='text'
								name='pickup_address'
								value={newOrder.pickup_address || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='formcontact_info'>
							<Form.Label>Контактная информация</Form.Label>
							<Form.Control
								type='text'
								name='contacts'
								value={newOrder.contacts || ''}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId='formcomment'>
							<Form.Label>Комментарий</Form.Label>
							<Form.Control
								type='text'
								name='comment'
								value={newOrder.comment || ''}
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group controlId='formpromo_code'>
							<Form.Label>Промокод</Form.Label>
							<Form.Control
								type='text'
								name='promocode'
								value={newOrder.promocode || ''}
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group controlId='formorder_price'>
							<Form.Label>Предварительная стоимость</Form.Label>
							<Form.Control
								type='number'
								name='price'
								value={newOrder.price || ''}
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
								Закрыть
							</Button>
							<Button
								type='submit'
								className={`${styles.btn_sucess}`}
								size='sm'
								variant='primary'
							>
								Создать заявку
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>
			<ToastContainer autoClose={3000} />
		</div>
	)
}

export default CreateOrderModal
