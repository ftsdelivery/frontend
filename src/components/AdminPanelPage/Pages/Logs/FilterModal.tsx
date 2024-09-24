import { Log } from '@/types/log.types'
import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './../Orders/Orders.module.css'

interface FilterModalProps {
	show: boolean
	onHide: () => void
	onApply: (filters: Partial<Log>) => void
	onReset: () => void
	currentFilters: Partial<Log>
}

const FilterModal: React.FC<FilterModalProps> = ({
	show,
	onHide,
	onApply,
	onReset,
	currentFilters,
}) => {
	const [filters, setFilters] = useState<Partial<Log>>(currentFilters)

	useEffect(() => {
		setFilters(currentFilters)
	}, [currentFilters, show])

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
				<Modal.Title>Фильтр логов</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId='filterStatus'>
						<Form.Label>Действие</Form.Label>
						<Form.Control
							as='select'
							name='action_type'
							value={filters.action_type || ''}
							onChange={handleChange}
						>
							<option value=''>Все</option>
							<option value='CREATE'>Создано</option>
							<option value='UPDATE'>Обновлено</option>
							<option value='DELETE'>Удалено</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='filterCreatedAtDate'>
						<Form.Label>Дата</Form.Label>
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
					<Form.Group controlId='filterAuthorID'>
						<Form.Label>Автор ID</Form.Label>
						<Form.Control
							type='text'
							name='author_id'
							value={filters.author_id || 0}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group controlId='filterMarketPlace'>
						<Form.Label>Таргет</Form.Label>
						<Form.Control
							as='select'
							name='target_name'
							value={filters.target_name || ''}
							onChange={handleChange}
						>
							<option value=''>Все</option>
							<option value='ORDER'>Заявка</option>
							<option value='PROMO'>Промокод</option>
							<option value='USER'>Пользователь</option>
							<option value='WAREHOUSE'>Склад</option>
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='filterAuthorID'>
						<Form.Label>Таргет ID</Form.Label>
						<Form.Control
							type='text'
							name='target_id'
							value={filters.target_id || 0}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='filterOldValue'>
						<Form.Label>Старое значение</Form.Label>
						<Form.Control
							type='text'
							name='old_value'
							value={filters.old_value || ''}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group controlId='filterNewValue'>
						<Form.Label>Новое значение</Form.Label>
						<Form.Control
							type='text'
							name='new_value'
							value={filters.new_value || ''}
							onChange={handleChange}
						/>
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
