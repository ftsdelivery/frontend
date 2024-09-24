import { Button, Modal } from 'react-bootstrap'

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
		<Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Подтверждение удаления</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Вы уверены, что хотите удалить этого пользователя? Это действие
				необратимо.
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Отмена
				</Button>
				<Button variant='danger' onClick={onConfirm}>
					Удалить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ConfirmDeleteModal
