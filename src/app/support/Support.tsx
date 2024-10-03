'use client'

import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { addTicket } from '@/services/ticket.service'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import styles from './Support.module.css'

export default function SupportPage() {
	const [user_id, setUserId] = useState(0)
	const [user_name, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [question_theme, setQuestionTheme] = useState('')
	const [question, setQuestion] = useState('')

	const handleSubmit = (e: any) => {
		e.preventDefault()
		// Логика отправки запроса
		addTicket({
			user_id,
			user_name,
			email,
			question_theme,
			question,
		})
			.then(() => {
				alert('Ваш запрос отправлен!')
				setUserName('')
				setEmail('')
				setQuestionTheme('')
				setQuestion('')
			})
			.catch(() => {
				alert('Произошла ошибка при отправке запроса')
			})
	}

	return (
		<div>
			<Navbar />
			<div className={styles.pageBackground}>
				<div className={`container mt-5 d-flex justify-content-center`}>
					<div className='col-lg-6 col-12'>
						<Alert
							variant='danger'
							className=' d-flex text-center justify-content-center align-items-center'
						>
							<p className='fw-bold'>
								<i className='bi bi-exclamation-triangle'></i> Модерация
								приложит все усилия, чтобы ответить вам в ближайшее время.
								Благодарим за ваше терпение.
							</p>
						</Alert>
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
									value={user_name}
									onChange={e => setUserName(e.target.value)}
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
									value={question_theme}
									onChange={e => setQuestionTheme(e.target.value)}
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
									value={question}
									onChange={e => setQuestion(e.target.value)}
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
