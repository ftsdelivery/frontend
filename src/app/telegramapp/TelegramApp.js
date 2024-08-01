"use client"

import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import styles from './TelegramApp.module.css'

export default function OrdersComponent() {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [orderData, setOrderData] = useState({
		telegramUser: 'user1',
		status: 'active',
		ip: '',
		marketplace: '',
		warehouse: '',
		deliveryType: '',
		quantity: '',
		extraService: '',
		pickupDate: '',
		pickupTime: '',
		pickupAddress: '',
		contactInfo: '',
		comment: '',
		promoCode: '',
		orderPrice: '5000'
	})
	const [warehouses, setWarehouses] = useState(['Не выбран маркетплейс'])

	useEffect(() => {
		Modal.setAppElement('#__next')
	}, [])

	useEffect(() => {
		if (orderData.marketplace === 'warehouse0') {
			setWarehouses(['Не выбран маркетплейс'])
		} else if (orderData.marketplace === 'warehouse1') {
			setWarehouses(['1', '3', '5'])
		} else if (orderData.marketplace === 'warehouse2') {
			setWarehouses(['2', '4', '6'])
		}
	}, [orderData.marketplace])

	function openModal() {
		setModalIsOpen(true)
	}

	function closeModal() {
		setModalIsOpen(false)
	}

	function handleInputChange(event) {
		const { name, value } = event.target
		setOrderData(prevData => ({
			...prevData,
			[name]: value
		}))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData) // Передаем данные в теле запроса
			})
			await response.json()
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className={styles.container} id="__next">
			<h1 className={styles.heading}>Привет!</h1>
			<p className={styles.description}>Здесь должно быть две кнопки "Заполнить заявку" и "Мои заявки". По кнопке Заполнить заявку должно появится модальное окно с формой "ИП", "Маркетплейс", "Склад", "Тип доставки", "Количество", "Доп. услуги", "Дата", "Временной интервал", "Адрес", "Контакты", "Комментарий", "Промокод"</p>
			<button className={styles.button} onClick={openModal}>Заполнить заявку</button>
			<button className={styles.button}>Мои заявки</button>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Форма заявки"
				overlayClassName={styles.modalOverlay}
				className={styles.modalContent}
				shouldCloseOnOverlayClick={true}
			>
				<h2>Форма заявки</h2>
				<form className={styles.form} onSubmit={handleSubmit}>
					<label className={styles.label}>
						ИП:
						<input className={styles.input} type="text" name="ip" value={orderData.ip} onChange={handleInputChange} required />
					</label>

					<label className={styles.label}>
						Маркетплейс:
						<select className={styles.input} name="marketplace" value={orderData.marketplace} onChange={handleInputChange}>
							<option value="warehouse0">Выберите маркетплейс</option>
							<option value="warehouse1">Маркетплейс 1</option>
							<option value="warehouse2">Маркетплейс 2</option>
						</select>
					</label>
					<label className={styles.label}>
						Склад:
						<select className={styles.input} name="warehouse" value={orderData.warehouse} onChange={handleInputChange} required>
							{warehouses.map((warehouse, index) => (
								<option key={index} value={warehouse}>{warehouse}</option>
							))}
						</select>
					</label>
					<label className={styles.label}>
						Тип доставки:
						<select className={styles.input} name="deliveryType" value={orderData.deliveryType} onChange={handleInputChange}>
							<option value="Не выбрано">Выберите тип доставки</option>
							<option value="Палеты">Палеты</option>
							<option value="Коробки">Коробки</option>
						</select>
					</label>
					<label className={styles.label}>
						Количество:
						<input className={styles.input} type="number" name="quantity" value={orderData.quantity} onChange={handleInputChange} required />
					</label>
					<label className={styles.label}>
						Доп. услуги:
						<input className={styles.input} type="text" name="extraService" value={orderData.extraService} onChange={handleInputChange} required />
					</label>
					<label className={styles.label}>
						Дата:
						<input className={styles.input} type="date" name="pickupDate" value={orderData.pickupDate} onChange={handleInputChange} required />
					</label>
					<label className={styles.label}>
						Временной интервал:
						<select className={styles.input} name="pickupTime" value={orderData.pickupTime} onChange={handleInputChange} required>
							<option value="10:00-12:00">Выберите временной интервал</option>
							<option value="10:00-12:00">10:00-12:00</option>
							<option value="12:00-14:00">12:00-14:00</option>
							<option value="14:00-16:00">14:00-16:00</option>
							<option value="16:00-18:00">16:00-18:00</option>
						</select>
					</label>
					<label className={styles.label}>
						Адрес:
						<input className={styles.input} type="text" name="pickupAddress" value={orderData.pickupAddress} onChange={handleInputChange} required />
					</label>
					<label className={styles.label}>
						Контакты:
						<input className={styles.input} type="text" name="contactInfo" value={orderData.contactInfo} onChange={handleInputChange} required />
					</label>
					<label className={styles.label}>
						Комментарий:
						<textarea className={styles.textarea} name="comment" value={orderData.comment} onChange={handleInputChange}></textarea>
					</label>
					<label className={styles.label}>
						Промокод:
						<input className={styles.input} type="text" name="promoCode" value={orderData.promoCode} onChange={handleInputChange} />
					</label>
					{/* <ReCAPTCHA sitekey='6LeZ_xoqAAAAAMSQZ5QABZUYRdSs9FCJfq_FIE9U' onChange={handleRecaptchaChange} /> */}
					<button className={`${styles.button} ${styles.submitButton}`} >Отправить</button>
					<button className={`${styles.button} ${styles.closeButton}`} type="button" onClick={closeModal}>Закрыть</button>
				</form>
			</Modal>
		</div>
	)
}