import { useState } from 'react'

const initialRoles = [
	// Пример ролей
	{ id: 1, name: 'Администратор', description: 'Полный доступ' },
	{ id: 2, name: 'Менеджер', description: 'Ограниченный доступ' },
]

const Roles = () => {
	const [roles, setRoles] = useState(initialRoles)

	const handleAddRole = () => {
		// Логика для добавления новой роли
	}

	const handleRemoveRole = (id: number) => {
		setRoles(roles.filter(role => role.id !== id))
	}

	return (
		<div>
			<h2>Управление ролями</h2>
			<button onClick={handleAddRole} className='btn btn-primary'>
				Добавить роль
			</button>
			<table className='table'>
				<thead>
					<tr>
						<th>Название</th>
						<th>Описание</th>
						<th>Права</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{roles.map(role => (
						<tr key={role.id}>
							<td>{role.name}</td>
							<td>{role.description}</td>
							<td>{/* Права роли */}</td>
							<td>
								<button
									onClick={() => handleRemoveRole(role.id)}
									className='btn btn-danger'
								>
									Удалить
								</button>
								{/* Кнопка для редактирования */}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default Roles
