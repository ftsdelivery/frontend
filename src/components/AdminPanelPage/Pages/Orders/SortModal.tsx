import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './Orders.module.css'

interface SortModalProps {
	show: boolean
	onHide: () => void
	onSort: (
		criteria:
			| 'id'
			| 'created_at'
			| 'pickup_date'
			| 'pickup_time'
			| 'price'
			| 'box_weight'
			| 'quantity',
		order: 'asc' | 'desc'
	) => void
}

const defaultCriteria:
	| 'id'
	| 'created_at'
	| 'pickup_date'
	| 'pickup_time'
	| 'price'
	| 'box_weight'
	| 'quantity' = 'id' // Измените здесь
const defaultOrder: 'asc' | 'desc' = 'asc'

const SortModal: React.FC<SortModalProps> = ({ show, onHide, onSort }) => {
	const [sortCriteria, setSortCriteria] = useState<
		| 'id'
		| 'created_at'
		| 'pickup_date'
		| 'pickup_time'
		| 'price'
		| 'quantity'
		| 'box_weight'
	>(defaultCriteria)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultOrder)

	useEffect(() => {
		if (show) {
			setSortCriteria(defaultCriteria)
			setSortOrder(defaultOrder)
		}
	}, [show])

	const handleReset = () => {
		setSortCriteria(defaultCriteria)
		setSortOrder(defaultOrder)
	}

	const handleSort = () => {
		onSort(sortCriteria, sortOrder)
		onHide()
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Сортировка заявок</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId='sortCriteria'>
						<Form.Label>Выберите критерий сортировки</Form.Label>
						<Form.Control
							as='select'
							value={sortCriteria}
							onChange={e =>
								setSortCriteria(
									e.target.value as
										| 'id'
										| 'created_at'
										| 'pickup_date'
										| 'pickup_time'
										| 'price'
										| 'box_weight'
										| 'quantity'
								)
							}
						>
							<option value='id'>№ Заявки</option>
							<option value='created_at'>Дата создания</option>
							<option value='pickup_date'>Дата забора</option>
							<option value='pickup_time'>Время забора</option>
							<option value='price'>Предварительная стоимость</option>
							<option value='quantity'>Количество</option>
							<option value='box_weight'>Вес коробоа</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId='sortOrder'>
						<Form.Label>Выберите порядок сортировки</Form.Label>
						<Form.Control
							as='select'
							value={sortOrder}
							onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
						>
							<option value='asc'>По возрастанию</option>
							<option value='desc'>По убыванию</option>
						</Form.Control>
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
					onClick={handleSort}
				>
					Применить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default SortModal
