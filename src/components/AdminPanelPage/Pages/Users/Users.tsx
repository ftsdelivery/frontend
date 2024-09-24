import { deleteUser, getUsers, updateUser } from '@/services/user.service'
import { User } from '@/types/user.types'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { toast } from 'sonner'
import styles from './../Orders/Orders.module.css'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import Paginate from './Paginate'
import UserModal from './UserModal'
import UsersTable from './UsersTable'

const Users = () => {
	const [users, setUsers] = useState<User[]>([])
	const [showEditModal, setShowEditModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(50)
	const [loading, setLoading] = useState(false)

	const fetchUsersData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getUsers()
			const totalCount = response.total
			setUsers(response.data)
			setTotalPages(Math.ceil(totalCount / itemsPerPage))
		} catch (error) {
			console.error('Ошибка при получении пользователей:', error)
			toast.error('Ошибка при получении пользователей')
		} finally {
			setLoading(false)
		}
	}, [itemsPerPage])

	useEffect(() => {
		fetchUsersData()
	}, [fetchUsersData])

	const handleEdit = (user: User | null) => {
		setSelectedUser(user)
		setShowEditModal(true)
	}

	const handleDelete = (user: User) => {
		setSelectedUser(user)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (selectedUser) {
			try {
				await deleteUser(selectedUser.id!)
				fetchUsersData()
				toast.success('Пользователь успешно удален')
			} catch (error) {
				console.error('Ошибка при удалении пользователя:', error)
				toast.error('Ошибка при удалении пользователя')
			} finally {
				setShowDeleteModal(false)
				setSelectedUser(null)
			}
		}
	}

	const handleSave = async (id: number, user: User) => {
		try {
			updateUser(id, user)
			toast.success('Пользователь успешно изменен')
			fetchUsersData()
		} catch (error) {
			console.error('Ошибка при изменении пользователя:', error)
			toast.error('Ошибка при изменении пользователя')
		} finally {
			setShowEditModal(false)
			setSelectedUser(null)
		}
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

	return (
		<div>
			<ButtonGroup className='mb-3'>
				<Button
					variant='primary'
					title='Обновить'
					onClick={fetchUsersData}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-arrow-clockwise'></i>
				</Button>
				<Form.Select
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
					size='sm'
					title='Количество пользователей на странице'
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
			) : users.length === 0 ? (
				<Alert variant='error' className='text-center'>
					Пользователи не найдены 😞
				</Alert>
			) : (
				<>
					<UsersTable
						users={users}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
					<Paginate
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			{showEditModal && (
				<UserModal
					show={showEditModal}
					user={selectedUser}
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
			<ToastContainer />
		</div>
	)
}

export default Users
