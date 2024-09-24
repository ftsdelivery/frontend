import {
	createOrder,
	deleteOrder,
	getAllOrdersWithPages,
	updateOrder,
} from '@/services/order.service'
import { Order } from '@/types/order.types'
import { User } from '@/types/user.types'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { toast } from 'sonner'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import CreateOrderModal from './CreateOrderModal'
import FilterModal from './FilterModal'
import OrderModal from './OrderModal'
import OrderModalLogs from './OrderModalLogs'
import styles from './Orders.module.css'
import OrdersTable from './OrdersTable'
import Paginate from './Paginate'
import SortModal from './SortModal'
import UserModal from './UserModal'
import ViewSettingsModal from './ViewSettingsModal'

const Orders = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showOrderLogsModal, setShowOrderLogsModal] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [filters, setFilters] = useState<Partial<Order>>({})
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)
	const [viewSettings, setViewSettings] = useState<{ [key: string]: boolean }>({
		status: true,
		created_at: true,
		ip: true,
		author_id: true,
		marketplace: true,
		warehouse: true,
		delivery_type: true,
		quantity: true,
		box_size: true,
		box_weight: true,
		extra_services: true,
		pickup_date: true,
		pickup_time: true,
		pickup_address: true,
		contacts: true,
		comment: true,
		promocode: true,
		price: true,
	})
	const [showViewSettingsModal, setShowViewSettingsModal] = useState(false)
	const [showSortModal, setShowSortModal] = useState(false)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [sortBy, setSortBy] = useState<
		| 'id'
		| 'created_at'
		| 'pickup_date'
		| 'pickup_time'
		| 'price'
		| 'quantity'
		| 'box_weight'
	>('id')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [showUserModal, setShowUserModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)

	const fetchOrdersData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getAllOrdersWithPages(
				currentPage,
				filters,
				itemsPerPage
			)
			const sortedOrders = response.data.sort((a: any, b: any) => {
				const valueA = a[sortBy]
				const valueB = b[sortBy]

				if (valueA == null || valueB == null) return 0

				if (typeof valueA === 'string' && typeof valueB === 'string') {
					return sortOrder === 'asc'
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA)
				}

				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
				}

				const dateA = new Date(valueA)
				const dateB = new Date(valueB)

				if (dateA instanceof Date && dateB instanceof Date) {
					return sortOrder === 'asc'
						? dateA.getTime() - dateB.getTime()
						: dateB.getTime() - dateA.getTime()
				}

				return 0
			})

			setOrders(sortedOrders)
			setTotalPages(Math.ceil(response.total / itemsPerPage))
		} catch (error) {
			console.error('Ошибка при получении заявок:', error)
			toast.error('Ошибка при получении заявок')
		} finally {
			setLoading(false)
		}
	}, [currentPage, filters, itemsPerPage, sortBy, sortOrder])

	useEffect(() => {
		fetchOrdersData()
	}, [fetchOrdersData])

	useEffect(() => {
		const savedColumns = JSON.parse(
			localStorage.getItem('columnSettings') || '{}'
		)
		setViewSettings(prevSettings => ({ ...prevSettings, ...savedColumns }))
	}, [])

	useEffect(() => {
		localStorage.setItem('columnSettings', JSON.stringify(viewSettings))
	}, [viewSettings])

	const handleEdit = (order: Order | null) => {
		setSelectedOrder(order)
		setShowEditModal(true)
	}

	const handleDelete = (order: Order) => {
		setSelectedOrder(order)
		setShowDeleteModal(true)
	}

	const handleUserClick = (user: User) => {
		setSelectedUser(user)
		setShowUserModal(true)
	}
	const [clickTimeout, setClickTimeout] = useState<number | null>(null)
	const handleDoubleClick = (order: Order) => {
		if (clickTimeout) {
			clearTimeout(clickTimeout)
			setSelectedOrder(order)
			setShowOrderLogsModal(true)
			setClickTimeout(null)
		} else {
			const timeout = window.setTimeout(() => {
				setClickTimeout(null)
			}, 250)
			setClickTimeout(timeout)
		}
	}

	const handleCloseModalLogs = () => {
		setShowOrderLogsModal(false)
		setSelectedOrder(null)
	}

	const handleCreateOrder = async (order: Order) => {
		try {
			await createOrder(order)
			toast.success('Заявка успешно создана')
			fetchOrdersData()
		} catch (error) {
			console.error('Ошибка при создании заявки:', error)
			toast.error('Ошибка при создании заявки')
		} finally {
			setShowCreateModal(false)
		}
	}

	const confirmDelete = async () => {
		if (selectedOrder) {
			try {
				await deleteOrder(selectedOrder.id!)
				fetchOrdersData()
				toast.success('Заявка успешно удалена')
			} catch (error) {
				console.error('Ошибка при удалении заявки:', error)
				toast.error('Ошибка при удалении заявки')
			} finally {
				setShowDeleteModal(false)
				setSelectedOrder(null)
			}
		}
	}

	const handleSort = (
		criteria:
			| 'id'
			| 'created_at'
			| 'pickup_date'
			| 'pickup_time'
			| 'price'
			| 'box_weight'
			| 'quantity',
		order: 'asc' | 'desc'
	) => {
		setSortBy(criteria)
		setSortOrder(order)
		fetchOrdersData()
	}

	const handleSave = async (id: number, order: Order) => {
		try {
			await updateOrder(id, order)
			toast.success('Заявка успешно изменена')
			fetchOrdersData()
		} catch (error) {
			console.error('Ошибка при изменении заявки:', error)
			toast.error('Ошибка при изменении заявки')
		} finally {
			setShowEditModal(false)
			setSelectedOrder(null)
		}
	}

	const loadFont = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/fonts/Roboto/Roboto-Medium.ttf`
		)
		const fontData = await response.arrayBuffer()
		const fontDataString = btoa(
			new Uint8Array(fontData).reduce(
				(data, byte) => data + String.fromCharCode(byte),
				''
			)
		)
		return fontDataString
	}

	const handleExport = async () => {
		const doc = new jsPDF('p', 'mm', 'a4')
		const fontDataString = await loadFont()
		doc.addFileToVFS('Roboto-Medium.ttf', fontDataString)
		doc.addFont('Roboto-Medium.ttf', 'Roboto', 'normal')
		doc.setFont('Roboto')

		doc.setFontSize(22)
		doc.setTextColor(40)
		doc.text('Список заявок', 70, 20)

		const columns = [
			{ header: '№', dataKey: 'id' },
			{ header: 'Дата создания', dataKey: 'created_at' },
			{ header: 'Статус', dataKey: 'status' },
			{ header: 'Автор', dataKey: 'author_id' },
			{ header: 'ИП', dataKey: 'ip' },
			{ header: 'Маркетплейс', dataKey: 'marketplace' },
			{ header: 'Склад', dataKey: 'warehouse' },
			{ header: 'Тип доставки', dataKey: 'delivery_type' },
			{ header: 'Количество', dataKey: 'quantity' },
			{ header: 'Доп. услуги', dataKey: 'extra_services' },
			{ header: 'Дата забора', dataKey: 'pickup_date' },
			{ header: 'Время забора', dataKey: 'pickup_time' },
			{ header: 'Адрес забора', dataKey: 'pickup_address' },
			{ header: 'Контактная информация', dataKey: 'contacts' },
			{ header: 'Комментарий', dataKey: 'comment' },
			{ header: 'Промо-код', dataKey: 'promocode' },
			{ header: 'Стоимость заказа', dataKey: 'price' },
		]

		const data = orders.map(order => ({
			id: order.id,
			status: order.status,
			author_id: order.author_id,
			created_at: order.created_at,
			ip: order.ip,
			marketplace: order.marketplace,
			warehouse: order.warehouse,
			delivery_type: order.delivery_type,
			quantity: order.quantity,
			extra_services: order.extra_services,
			pickup_date: order.pickup_date,
			pickup_time: order.pickup_time,
			pickup_address: order.pickup_address,
			contact_info: order.contacts,
			comment: order.comment,
			promo_code: order.promocode,
			order_price: order.price,
		}))

		;(doc as any).autoTable({
			head: [columns.map(col => col.header)],
			body: data.map((row: any) => columns.map(col => row[col.dataKey])),
			startY: 40,
			theme: 'striped',
			headStyles: {
				fillColor: [22, 160, 133],
				textColor: 255,
				fontSize: 10,
				fontStyle: 'bold',
			},
			bodyStyles: {
				textColor: 50,
				fontSize: 9,
			},
			styles: {
				font: 'Roboto',
				lineColor: 200,
				lineWidth: 0.5,
				cellPadding: 3,
				fontSize: 9,
				overflow: 'linebreak',
			},
			pageBreak: 'auto',
			margin: { top: 30, left: 10, right: 10 },
		})

		doc.save('orders.pdf')
	}

	const handleViewSettings = () => {
		setShowViewSettingsModal(true)
	}

	const handleViewSettingsSave = (settings: { [key: string]: boolean }) => {
		setViewSettings(settings)
		setShowViewSettingsModal(false)
	}

	const applyFilters = (filters: Partial<Order>) => {
		setFilters(filters)
		setCurrentPage(1)
	}

	const resetFilters = () => {
		setFilters({})
		setCurrentPage(1)
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

	const filteredOrders = orders.filter(order => {
		return (
			(!filters.marketplace ||
				order.marketplace
					?.toLowerCase()
					.includes(filters.marketplace.toLowerCase())) &&
			(!filters.status || order.status === filters.status) &&
			(!filters.price || order.price === filters.price)
		)
	})

	return (
		<div>
			<ButtonGroup className='mb-3'>
				<Button
					variant='success'
					title='Создать заявку'
					onClick={() => setShowCreateModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-plus-lg'></i>
				</Button>
				<Button
					variant='primary'
					title='Фильтровать'
					onClick={() => setShowFilterModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-funnel'></i>
				</Button>
				<Button
					variant='primary'
					title='Сортировать'
					onClick={() => setShowSortModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-sort-alpha-down'></i>
				</Button>
				<Button
					variant='primary'
					title='Обновить'
					onClick={fetchOrdersData}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-arrow-clockwise'></i>
				</Button>
				<Button
					variant='primary'
					title='Настройки столбцов'
					onClick={handleViewSettings}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-eye'></i>
				</Button>
				<Button
					variant='secondary'
					title='Экспортировать'
					onClick={handleExport}
					size='sm'
					className={`me-2 ${styles.btn_secondary}`}
				>
					<i className='bi bi-download'></i>
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Form.Select
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
					size='sm'
					className='mb-3 ms-2'
					title='Количество заявок на странице'
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
					<option value={500}>500</option>
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
			) : filteredOrders.length === 0 ? (
				<Alert variant='danger' className='text-center'>
					Заявки не найдены 😞
				</Alert>
			) : (
				<>
					<OrdersTable
						orders={filteredOrders}
						viewSettings={viewSettings}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onUserClick={handleUserClick}
						onDoubleClick={handleDoubleClick}
					/>
					<Paginate
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			{showEditModal && (
				<OrderModal
					show={showEditModal}
					order={selectedOrder}
					onHide={() => setShowEditModal(false)}
					onSave={handleSave}
				/>
			)}

			{showDeleteModal && (
				<ConfirmDeleteModal
					show={showDeleteModal}
					onHide={() => setShowDeleteModal(false)}
					onConfirm={confirmDelete}
				/>
			)}

			{showFilterModal && (
				<FilterModal
					show={showFilterModal}
					onHide={() => setShowFilterModal(false)}
					onApply={applyFilters}
					onReset={resetFilters}
					currentFilters={filters}
				/>
			)}

			{showViewSettingsModal && (
				<ViewSettingsModal
					show={showViewSettingsModal}
					onHide={() => setShowViewSettingsModal(false)}
					onSave={handleViewSettingsSave}
					currentSettings={viewSettings}
				/>
			)}

			{showSortModal && (
				<SortModal
					show={showSortModal}
					onHide={() => setShowSortModal(false)}
					onSort={handleSort}
				/>
			)}

			{showUserModal && (
				<UserModal
					show={showUserModal}
					user={selectedUser}
					onHide={() => setShowUserModal(false)}
				/>
			)}

			{showCreateModal && (
				<CreateOrderModal
					show={showCreateModal}
					onHide={() => setShowCreateModal(false)}
					onSave={handleCreateOrder}
				/>
			)}

			{showOrderLogsModal && (
				<OrderModalLogs
					show={showOrderLogsModal}
					onHide={handleCloseModalLogs}
					order={selectedOrder}
				/>
			)}

			<ToastContainer />
		</div>
	)
}

export default Orders
