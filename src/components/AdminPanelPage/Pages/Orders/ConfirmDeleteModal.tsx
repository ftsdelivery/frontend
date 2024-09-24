import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import styles from './Orders.module.css'

interface ConfirmDeleteModalProps {
	show: boolean
	onHide: () => void
	onConfirm: () => void
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	show,
	onHide,
	onConfirm,
}) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Подтверждение удаления</Modal.Title>
			</Modal.Header>
			<Modal.Body>Вы уверены, что хотите удалить эту заявку?</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					className={`${styles.btn_secondary}`}
					onClick={onHide}
				>
					Отмена
				</Button>
				<Button
					variant='danger'
					className={`${styles.btn_danger}`}
					onClick={onConfirm}
				>
					Удалить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ConfirmDeleteModal
