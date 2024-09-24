import { getWarehouses } from '@/services/warehouses.service'
import { Order } from '@/types/order.types'
import { Warehouse } from '@/types/warehouse.types'
import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Orders.module.css'

interface FilterModalProps {
	show: boolean
	onHide: () => void
	onApply: (filters: Partial<Order>) => void
	onReset: () => void
	currentFilters: Partial<Order>
}

const FilterModal: React.FC<FilterModalProps> = ({
	show,
	onHide,
	onApply,
	onReset,
	currentFilters,
}) => {
	const [filters, setFilters] = useState<Partial<Order>>(currentFilters)
	const [availableWarehouses, setAvailableWarehouses] = useState<
		{ id: number; name: string; description: string }[]
	>([])

	const [validated, setValidated] = useState(false)
	const [warehousesOzon, setWarehousesOzon] = useState<Warehouse[]>([])
	const [warehousesYandex, setWarehousesYandex] = useState<Warehouse[]>([])
	const [warehousesWildberries, setWarehousesWildberries] = useState<
		Warehouse[]
	>([])

	const warehouses: Record<
		string,
		{ id: number; name: string; description: string }[]
	> = {
		'Яндекс Маркет': warehousesYandex,
		Ozon: warehousesOzon,
		Wildberries: warehousesWildberries,
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
		setFilters(currentFilters)
	}, [currentFilters, show])

	useEffect(() => {
		if (filters.marketplace) {
			setAvailableWarehouses(warehouses[filters.marketplace] || [])
		} else {
			setAvailableWarehouses([])
		}
	}, [filters.marketplace])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target
		setFilters(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleDateChange = (date: Date | null, key: string) => {
		setFilters(prev => ({
			...prev,
			[key]: date ? date.toISOString().split('T')[0] : '',
		}))
	}

	const handleApply = () => {
		onApply(filters)
		onHide()
	}

	const handleReset = () => {
		setFilters({})
		onReset()
		onHide()
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Фильтр заявок</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId='filterStatus'>
						<Form.Label>Статус</Form.Label>
						<Form.Control
							as='select'
							name='status'
							value={filters.status || ''}
							onChange={handleChange}
						>
							<option value=''>Все</option>
							<option value='PENDING'>В ожидании</option>
							<option value='CONFIRMED'>Подтверждено</option>
							<option value='DELIVERED'>Доставлено</option>
							<option value='OVERDUE'>Просрочено</option>
							<option value='CANCELED'>Отменено</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='filterCreatedAtDate'>
						<Form.Label>Дата создания</Form.Label>
						<div style={{ marginTop: '5px' }}>
							<DatePicker
								selected={
									filters.created_at ? new Date(filters.created_at) : null
								}
								onChange={date => handleDateChange(date, 'created_at')}
								dateFormat='yyyy-MM-dd'
								placeholderText='Выберите дату'
								className='form-control'
								popperPlacement='bottom-end'
								isClearable
							/>
						</div>
					</Form.Group>
					<Form.Group controlId='filterIP'>
						<Form.Label>ИП</Form.Label>
						<Form.Control
							type='text'
							name='ip'
							value={filters.ip || ''}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group controlId='filterMarketPlace'>
						<Form.Label>Маркетплейс</Form.Label>
						<Form.Control
							as='select'
							name='marketplace'
							value={filters.marketplace || ''}
							onChange={handleChange}
						>
							<option value=''>Все</option>
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
							value={filters.warehouse || ''}
							onChange={handleChange}
							disabled={!filters.marketplace}
						>
							<option value=''>Выберите склад</option>
							{availableWarehouses.map(warehouse => (
								<option key={warehouse.id} value={warehouse.name}>
									{warehouse.name} - {warehouse.description}
								</option>
							))}
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='filterPickupDate'>
						<Form.Label>Дата забора</Form.Label>
						<div style={{ marginTop: '5px' }}>
							<DatePicker
								selected={
									filters.pickup_date ? new Date(filters.pickup_date) : null
								}
								onChange={date => handleDateChange(date, 'pickup_date')}
								dateFormat='yyyy-MM-dd'
								placeholderText='Выберите дату'
								className='form-control'
								popperPlacement='bottom-end'
								isClearable
							/>
						</div>
					</Form.Group>
				</Form>
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
				<Button
					variant='secondary'
					className={`${styles.btn_secondary}`}
					size='sm'
					onClick={onHide}
				>
					Закрыть
				</Button>
				<Button
					variant='primary'
					className={`${styles.btn_sucess}`}
					size='sm'
					onClick={handleApply}
				>
					Применить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default FilterModal
