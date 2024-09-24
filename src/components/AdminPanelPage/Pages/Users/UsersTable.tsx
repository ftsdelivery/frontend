import { User } from '@/types/user.types'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import styles from './../Orders/Orders.module.css'

interface UsersTableProps {
	users: User[]
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

const RoleColors: Record<string, string> = {
	ADMINISTRATOR: `badge ${styles.badge_danger}`,
	USER: `badge ${styles.badge_primary}`,
}

const RoleTranslations: Record<string, { label: string; icon: string }> = {
	ADMINISTRATOR: { label: 'Администратор', icon: 'bi bi-shield-check' },
	USER: { label: 'Пользователь', icon: 'bi bi-person' },
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
	return (
		<div className={styles.table_container}>
			<div
				className={styles.table_container_responsive}
				style={{
					maxWidth: '100vw',
					overflowY: 'auto',
				}}
			>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>ID</th>
							<th>Дата регистрации</th>
							<th>Имя</th>
							<th>Почта</th>
							<th>Роль</th>
							<th>Использованные промокоды</th>
							<th>Количество заявок</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{users.map(user => {
							let promoCodesArray: string[] = []

							if (typeof user.used_promocodes === 'string') {
								try {
									promoCodesArray = JSON.parse(user.used_promocodes)
								} catch (e) {
									console.error('Ошибка разбора промокодов:', e)
								}
							} else if (Array.isArray(user.used_promocodes)) {
								promoCodesArray = user.used_promocodes
							}

							const promoCodeSpans =
								promoCodesArray.length > 0
									? promoCodesArray.map((code, index) => (
											<span
												key={index}
												className={`badge ${styles.badge_gray} me-1`}
											>
												<span className='bi bi-tags me-1'></span>
												{code}
											</span>
									  ))
									: 'Нет использованных промокодов'

							const role = user.role as keyof typeof RoleTranslations
							const { label, icon } = RoleTranslations[role] || {
								label: 'Неизвестно',
								icon: 'bi bi-question-circle',
							}

							return (
								<tr key={user.id}>
									<td>{user.id}</td>
									<td>
										{new Date(user.created_at ?? '').toLocaleDateString(
											'ru-RU',
											{
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											}
										)}
									</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>
										<span
											className={`${RoleColors[role]} me-3 d-inline-flex align-items-center`}
										>
											<i className={icon + ' me-1'}></i>
											{label}
										</span>
									</td>
									<td>{promoCodeSpans}</td>
									<td>{user.orders_count}</td>
									<td>
										<ButtonGroup>
											<Button
												variant='warning'
												title='Редактировать'
												onClick={() => onEdit(user)}
											>
												<i className='bi bi-pencil-square'></i>
											</Button>
											<Button
												variant='danger'
												title='Удалить'
												onClick={() => onDelete(user)}
											>
												<i className='bi bi-trash'></i>
											</Button>
										</ButtonGroup>
									</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		</div>
	)
}

export default UsersTable
