import { Log } from '@/types/log.types'
import { Table } from 'react-bootstrap'
import styles from './../Orders/Orders.module.css'

interface UsersTableProps {
	logs: Log[]
}

const actionColors: Record<string, string> = {
	CREATE: `badge ${styles.badge_success}`,
	DELETE: `badge ${styles.badge_danger}`,
	UPDATE: `badge ${styles.badge_primary}`,
}

const actionIcons: Record<string, string> = {
	CREATE: 'bi bi-plus-circle', // Иконка для создания
	DELETE: 'bi bi-x-circle', // Иконка для удаления
	UPDATE: 'bi bi-pencil', // Иконка для обновления
}

const actionTranslations: Record<string, string> = {
	CREATE: 'Создано',
	DELETE: 'Удалено',
	UPDATE: 'Изменено',
}

const targetColors: Record<string, string> = {
	ORDER: `badge ${styles.badge_gray}`,
	PROMO: `badge ${styles.badge_gray}`,
	USER: `badge ${styles.badge_gray}`,
	WAREHOUSE: `badge ${styles.badge_gray}`,
	NEWS: `badge ${styles.badge_gray}`,
}

const targetIcons: Record<string, string> = {
	ORDER: 'bi bi-file-earmark-text', // Иконка для заявки
	PROMO: 'bi bi-tags', // Иконка для промокода
	USER: 'bi bi-person', // Иконка для пользователя
	WAREHOUSE: 'bi bi-house', // Иконка для склада
	NEWS: 'bi bi-newspaper', // Иконка для новости
}

const targetTranslations: Record<string, string> = {
	ORDER: 'Заявка',
	PROMO: 'Промокод',
	USER: 'Пользователь',
	WAREHOUSE: 'Склад',
	NEWS: 'Новость',
}

const LogsTable: React.FC<UsersTableProps> = ({ logs }) => {
	return (
		<div
			style={{ maxWidth: '100vw', overflowY: 'auto', paddingRight: '300px' }}
		>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>ID</th>
						<th>Дата</th>
						<th>Действие</th>
						<th>Таргет</th>
						<th>ID Таргета</th>
						<th>Пользователь</th>
						<th>Старое значение</th>
						<th>Новое значение</th>
					</tr>
				</thead>
				<tbody>
					{logs.map(log => {
						const actionColorClass =
							actionColors[log.action_type || ''] || 'badge'
						const actionIconClass =
							actionIcons[log.action_type || ''] || 'bi bi-circle' // Иконка по умолчанию
						const targetColorClass =
							targetColors[log.target_name || ''] || 'badge'
						const targetIconClass =
							targetIcons[log.target_name || ''] || 'bi bi-circle' // Иконка по умолчанию
						return (
							<tr key={log.id}>
								<td>{log.id}</td>
								<td>
									{new Date(log.created_at ?? '').toLocaleDateString('ru-RU', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
									})}
								</td>
								<td>
									<span className={`${actionColorClass} me-3`}>
										<i className={actionIconClass}></i> {/* Иконка действия */}
										{actionTranslations[log.action_type || '']}
									</span>
								</td>
								<td>
									<span className={`${targetColorClass} me-3`}>
										<i className={targetIconClass}></i> {/* Иконка таргета */}
										{targetTranslations[log.target_name || '']}
									</span>
								</td>
								<td>{log.target_id}</td>
								<td>{log.author_id}</td>
								<td>{log.old_value || '-'}</td>
								<td>{log.new_value || '-'}</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</div>
	)
}

export default LogsTable
