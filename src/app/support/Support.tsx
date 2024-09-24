'use client'

import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { useState } from 'react'
import styles from './Support.module.css'

export default function SupportPage() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')

	const handleSubmit = (e: any) => {
		e.preventDefault()
		// Логика отправки запроса
		console.log({ name, email, subject, message })
	}

	return (
		<div>
			<Navbar />
			<div className={styles.pageBackground}>
				<div className={`container mt-5 d-flex justify-content-center`}>
					<div className='col-lg-6 col-12'>
						<h2 className='text-center mb-4'>
							Форма подачи запроса в поддержку
						</h2>
						<form onSubmit={handleSubmit}>
							<div className='mb-3'>
								<label htmlFor='name' className='form-label'>
									Ваше Имя
								</label>
								<input
									type='text'
									className={`form-control ${styles.form_control}`}
									id='name'
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</div>

							<div className='mb-3'>
								<label htmlFor='email' className='form-label'>
									Почта
								</label>
								<input
									type='email'
									className={`form-control ${styles.form_control}`}
									id='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className='mb-3'>
								<label htmlFor='subject' className='form-label'>
									Тема вопроса
								</label>
								<select
									id='subject'
									className={`form-select ${styles.option_control}`}
									value={subject}
									onChange={e => setSubject(e.target.value)}
									required
								>
									<option value=''>Выберите тему</option>
									<option value='general'>Общие вопросы</option>
									<option value='technical'>Техническая поддержка</option>
									<option value='billing'>Вопросы по оплате</option>
								</select>
							</div>

							<div className='mb-3'>
								<label htmlFor='message' className='form-label'>
									Вопрос
								</label>
								<textarea
									id='message'
									className={`form-control ${styles.form_control}`}
									rows={5}
									value={message}
									onChange={e => setMessage(e.target.value)}
									required
								/>
							</div>

							<button type='submit' className='btn btn-primary w-100'>
								Отправить
							</button>
						</form>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
