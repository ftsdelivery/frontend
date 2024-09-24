import React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface ConfirmDeletePromoCodeModalProps {
	show: boolean
	onHide: () => void
	onConfirm: () => void
}

const ConfirmDeletePromoCodeModal: React.FC<
	ConfirmDeletePromoCodeModalProps
> = ({ show, onHide, onConfirm }) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Подверждения удаления</Modal.Title>
			</Modal.Header>
			<Modal.Body>Вы уверенны что хотите удалить этот промокод?</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Отменить
				</Button>
				<Button variant='danger' onClick={onConfirm}>
					Удалить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ConfirmDeletePromoCodeModal
