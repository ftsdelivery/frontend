import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import styles from './Orders.module.css'

interface ViewSettingsModalProps {
	show: boolean
	onHide: () => void
	onSave: (settings: { [key: string]: boolean }) => void
	currentSettings: { [key: string]: boolean }
}

const ViewSettingsModal: React.FC<ViewSettingsModalProps> = ({
	show,
	onHide,
	onSave,
	currentSettings,
}) => {
	const [settings, setSettings] = useState(currentSettings)

	const handleCheckboxChange = (key: string) => {
		setSettings(prevSettings => ({
			...prevSettings,
			[key]: !prevSettings[key],
		}))
	}

	const handleSave = () => {
		onSave(settings)
	}

	const translations: { [key: string]: string } = {
		status: 'Статус',
		created_at: 'Дата создания',
		ip: 'ИП',
		author_id: 'ID автора',
		marketplace: 'Маркетплейс',
		warehouse: 'Склад',
		delivery_type: 'Тип доставки',
		quantity: 'Количество',
		extra_services: 'Дополнительные услуги',
		box_size: 'Размер короба',
		box_weight: 'Вес короба',
		pickup_date: 'Дата забора',
		pickup_time: 'Время забора',
		pickup_address: 'Адрес забора',
		contacts: 'Контактная информация',
		comment: 'Комментарий',
		promocode: 'Промокод',
		price: 'Предварительная стоимость',
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Настройки представления</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					{Object.keys(currentSettings).map(key => (
						<Form.Check
							key={key}
							type='switch'
							id={`custom-switch-${key}`}
							label={translations[key] || key}
							checked={settings[key]}
							onChange={() => handleCheckboxChange(key)}
						/>
					))}
				</Form>
			</Modal.Body>
			<Modal.Footer>
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
					onClick={handleSave}
				>
					Применить
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ViewSettingsModal
