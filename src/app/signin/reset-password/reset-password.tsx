'use client'

import { getUserIdByResetToken, updateUser } from '@/services/user.service' // Импортируйте ваши функции
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './../page.module.css'

export default function ResetPassword() {
	const [password, setPassword] = useState('')
	const [passwordStrength, setPasswordStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(false)
	const [userId, setUserId] = useState<number | null>(null) // Состояние для хранения ID пользователя
	const router = useRouter()
	const [token, setToken] = useState<string | null>(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const urlToken = new URLSearchParams(window.location.search).get('token')
			setToken(urlToken) // Сохраняем токен в состоянии
		}
	}, [])

	useEffect(() => {
		const fetchUserIdByEmail = async () => {
			const id = await getUserIdByResetToken(token || '')
			setUserId(id)
		}

		fetchUserIdByEmail()
	}, [token])

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handlePasswordStrengthChange = (score: number) => {
		setPasswordStrength(score)
	}

	const toggleShowPassword = () => {
		setShowPassword(prevState => !prevState)
	}

	const handleResetPasswordSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault()

		// if (passwordStrength < 3) {
		// 	toast.error(
		// 		'Пароль недостаточно надежен. Пожалуйста, используйте более сложный пароль.'
		// 	)
		// 	return
		// }

		try {
			const hashedPassword = await bcrypt.hash(password, 10)
			if (userId) {
				await updateUser(userId, {
					password: hashedPassword,
					reset_token: null,
				})
				toast.success('Пароль успешно обновлён!')
				router.push('/signin') // Перенаправление на страницу входа
			} else {
				toast.error('ID пользователя не найден. Попробуйте снова.')
			}
		} catch (error) {
			console.error('Ошибка при обновлении пароля:', error)
			toast.error('Произошла ошибка при обновлении пароля.')
		}
	}

	return (
		<div className={styles.Main}>
			<div className={`container w-50 pt-5 ${styles.Container}`}>
				<h1 className={`text-center ${styles.text_center}`}>Сброс пароля</h1>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<form onSubmit={handleResetPasswordSubmit}>
							<div className='mb-3 pt-5'>
								<label className={`form-label ${styles.form_label}`}>
									Новый пароль
								</label>
								<div className='input-group'>
									<input
										type={showPassword ? 'text' : 'password'}
										name='password'
										className={`form-control ${styles.form_control}`}
										placeholder='Введите новый пароль'
										required
										value={password}
										onChange={handlePasswordChange}
									/>
									<span
										className={`input-group-text ${styles.input_group_text}`}
										onClick={toggleShowPassword}
										style={{ cursor: 'pointer' }}
									>
										<i
											className={`bi ${
												showPassword ? 'bi-eye-slash' : 'bi-eye'
											}`}
										></i>
									</span>
								</div>
							</div>

							<div className='d-grid'>
								<button
									type='submit'
									className={`btn btn-primary ${styles.LoginButton}`}
									// disabled={passwordStrength < 3}
								>
									Обновить пароль
								</button>
							</div>
						</form>
						<div className='d-flex flex-column align-items-center'>
							<button
								type='button'
								className={`btn btn-link mt-4 ${styles.toggle_button}`}
								onClick={() => router.push('/login')}
							>
								Вернуться к входу
							</button>
						</div>
					</div>
				</div>
				<ToastContainer autoClose={1500} pauseOnFocusLoss={false} limit={3} />
			</div>
		</div>
	)
}
