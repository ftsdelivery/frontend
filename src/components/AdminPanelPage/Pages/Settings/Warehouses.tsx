import {
	addWarehouse,
	getWarehouses,
	removeWarehouse,
	updateWarehouse,
} from '@/services/warehouses.service'
import type { Warehouse } from '@/types/warehouse.types'
import { playSuccessSound } from '@/utils/SoundEffects'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form, Modal, Table } from 'react-bootstrap'
import { toast } from 'sonner'
import styles from './../Orders/Orders.module.css'

const Warehouses = () => {
	const [selectedMarketplace, setSelectedMarketplace] = useState(1) // ID маркетплейса по умолчанию
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [showModal, setShowModal] = useState(false)
	const [isEditing, setIsEditing] = useState(false) // состояние для редактирования

	const [currentWarehouse, setCurrentWarehouse] = useState<Warehouse | null>(
		null
	) // состояние для текущего склада
	const [newWarehouse, setNewWarehouse] = useState({
		name: '',
		description: '',
	})
	const [loading, setLoading] = useState(true) // Добавляем состояние загрузки
	const [noWarehouses, setNoWarehouses] = useState(false) // состояние для отслеживания отсутствия складов

	const fetchWarehouses = useCallback(async () => {
		setLoading(true) // Устанавливаем состояние загрузки в true
		try {
			const data = await getWarehouses(selectedMarketplace)
			if (data.data.length === 0) {
				setNoWarehouses(true)
			} else {
				setNoWarehouses(false)
				setWarehouses(data.data)
			}
		} catch (error) {
			setNoWarehouses(true)
			setWarehouses([])
		} finally {
			setLoading(false) // Устанавливаем состояние загрузки в false
		}
	}, [selectedMarketplace])

	useEffect(() => {
		fetchWarehouses()
	}, [selectedMarketplace, fetchWarehouses])

	const handleMarketplaceChange = (marketplace_id: number) => {
		setSelectedMarketplace(marketplace_id)
	}

	const handleAddWarehouseClick = () => {
		setIsEditing(false) // Установка режима добавления
		setNewWarehouse({ name: '', description: '' }) // Очистка данных
		setShowModal(true)
	}

	const handleEditWarehouseClick = (warehouse: Warehouse) => {
		setIsEditing(true) // Установка режима редактирования
		setCurrentWarehouse(warehouse)
		setNewWarehouse({
			name: warehouse.name,
			description: warehouse.description,
		})
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setNewWarehouse({ name: '', description: '' })
		setCurrentWarehouse(null)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setNewWarehouse(prev => ({ ...prev, [name]: value }))
	}

	const handleSaveWarehouse = async () => {
		try {
			if (isEditing && currentWarehouse) {
				// Редактирование существующего склада
				await updateWarehouse(
					currentWarehouse.id,
					newWarehouse.name,
					newWarehouse.description,
					selectedMarketplace
				)
				setWarehouses(
					warehouses.map(wh =>
						wh.id === currentWarehouse.id
							? {
									...wh,
									name: newWarehouse.name,
									description: newWarehouse.description,
							  }
							: wh
					)
				)
				toast.success('Склад успешно обновлен')
				playSuccessSound()
				fetchWarehouses()
			} else {
				// Добавление нового склада
				const newWh = await addWarehouse(
					newWarehouse.name,
					newWarehouse.description,
					selectedMarketplace
				)
				setWarehouses([...warehouses, newWh.data])
				toast.success('Склад успешно добавлен')
				playSuccessSound()
				fetchWarehouses()
			}
			handleModalClose()
		} catch (error) {
			console.error('Ошибка при сохранении склада:', error)
			toast.error('Ошибка при сохранении склада')
		} finally {
			setNewWarehouse({ name: '', description: '' })
			setCurrentWarehouse(null)
		}
	}

	const marketplaceNames: { [key: number]: string } = {
		1: 'Ozon',
		2: 'Яндекс Маркет',
		3: 'WildBerries',
	}

	const handleRemoveWarehouse = async (id: number) => {
		try {
			await removeWarehouse(id)
			toast.success('Склад успешно удален')
			playSuccessSound()
			setWarehouses(warehouses.filter(wh => wh.id !== id))
			fetchWarehouses()
		} catch (error) {
			toast.error('Ошибка при удалении склада')
			console.error('Ошибка при удалении склада:', error)
		}
	}

	return (
		<div>
			<div className='col'>
				<div className='col-10'>
					<h2>Управление складами</h2>
					<Button
						variant={`${selectedMarketplace === 1 ? 'primary' : 'secondary'}`}
						onClick={() => handleMarketplaceChange(1)}
						className={`m-1 ${styles.btn_warning}`}
					>
						<Image
							src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/ozon.png`}
							width={20}
							height={20}
							alt=''
							className='me-2'
						/>
						Ozon
					</Button>
					<Button
						variant={`${selectedMarketplace === 2 ? 'primary' : 'secondary'}`}
						onClick={() => handleMarketplaceChange(2)}
						className={`m-1 ${styles.btn_warning}`}
					>
						<Image
							src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/ym3.jpg`}
							width={20}
							height={20}
							alt=''
							className='me-2'
						/>
						Яндекс Маркет
					</Button>
					<Button
						variant={`${selectedMarketplace === 3 ? 'primary' : 'secondary'}`}
						onClick={() => handleMarketplaceChange(3)}
						className={`m-1 ${styles.btn_warning}`}
					>
						<Image
							src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/marketplaces/wb.jpg`}
							width={20}
							height={20}
							alt=''
							className='me-2'
						/>
						WildBerries
					</Button>
					<Button
						variant='success'
						onClick={handleAddWarehouseClick}
						title='Добавить склад'
						size='sm'
						className={`m-1 ${styles.btn_warning}`}
					>
						<i className='bi bi-plus-lg me-2'></i>
						Добавить склад
					</Button>
				</div>
			</div>
			<div className={styles.table_container}>
				<div
					className={styles.table_container_responsive}
					style={{
						maxWidth: '100vw',
						overflowY: 'auto',
					}}
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
					) : noWarehouses ? (
						<Alert
							variant='danger'
							className='mt-3 d-flex align-items-center justify-content-center'
						>
							😞 Склады для выбранного маркетплейса отсутствуют
						</Alert>
					) : (
						<div>
							<div className='mt-3'>
								Выбранный склад:{' '}
								{selectedMarketplace
									? marketplaceNames[selectedMarketplace]
									: ''}
							</div>
							<Table striped bordered hover responsive className='mt-3'>
								<thead>
									<tr>
										<th>ID</th>
										<th>Название</th>
										<th>Описание</th>
										<th>Действия</th>
									</tr>
								</thead>
								<tbody>
									{warehouses.map(wh => (
										<tr key={wh.id}>
											<td>{wh.id}</td>
											<td>{wh.name}</td>
											<td>{wh.description}</td>
											<td>
												<ButtonGroup>
													<Button
														variant='warning'
														onClick={() => handleEditWarehouseClick(wh)}
														className={`${styles.btn_warning}`}
													>
														<i className='bi bi-pencil-square'></i>
													</Button>
													<Button
														variant='danger'
														onClick={() => handleRemoveWarehouse(wh.id)}
														className={`${styles.btn_danger}`}
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
					)}
				</div>
			</div>

			{/* Modal */}
			<Modal show={showModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						{isEditing ? 'Редактировать склад' : 'Добавить склад'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='warehouseName'>
							<Form.Label>Название склада</Form.Label>
							<Form.Control
								type='text'
								name='name'
								value={newWarehouse.name}
								onChange={handleInputChange}
								placeholder='Введите название склада'
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='warehouseDescription'>
							<Form.Label>Описание склада</Form.Label>
							<Form.Control
								type='text'
								name='description'
								value={newWarehouse.description}
								onChange={handleInputChange}
								placeholder='Введите описание склада'
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleModalClose}>
						Отмена
					</Button>
					<Button variant='primary' onClick={handleSaveWarehouse}>
						{isEditing ? 'Сохранить изменения' : 'Сохранить'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Warehouses
