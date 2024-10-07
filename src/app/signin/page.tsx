'use client'

import {
	createUser,
	getUserByEmail,
	sendResetPasswordEmail,
} from '@/services/user.service'
import bcrypt from 'bcryptjs' // Импортируем bcrypt
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import PasswordStrengthBar from 'react-password-strength-bar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './page.module.css'

export default function SignIn() {
	const [isRegistering, setIsRegistering] = useState(false)
	const [isResettingPassword, setIsResettingPassword] = useState(false) // Состояние для восстановления пароля
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('') // Состояние для хранения email
	const [passwordStrength, setPasswordStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(false)
	const [isLoginSuccessful, setIsLoginSuccessful] = useState(false)
	const router = useRouter()

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const handlePasswordStrengthChange = (score: number) => {
		setPasswordStrength(score)
	}

	const toggleShowPassword = () => {
		setShowPassword(prevState => !prevState)
	}

	const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		try {
			const user = await getUserByEmail(email)
			console.log(user)

			if (user === null) {
				toast.error('Пользователь с такой почтой не найден')
				return
			}

			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (!isPasswordValid) {
				toast.error('Неправильный пароль')
				return
			}

			const res = await signIn('credentials', {
				email: email,
				password: user.password,
				redirect: false,
			})

			console.log(res)

			if (res && !res.error) {
				toast.success('Вы успешно вошли в систему')
				setIsLoginSuccessful(true)
				router.push('/account')
			} else {
				toast.error('Произошла ошибка при входе')
			}
		} catch (error) {
			console.error('Ошибка при входе:', error)
			toast.error('Произошла ошибка при входе')
		}
	}

	const handleRegisterSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const password = formData.get('password') as string
		const confirmPassword = formData.get('confirmPassword')

		if (passwordStrength < 3) {
			toast.error(
				'Пароль недостаточно надежен. Пожалуйста, используйте более сложный пароль.'
			)
			return
		}

		if (password !== confirmPassword) {
			toast.error('Пароли не совпадают', {
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
			return
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 10)

			await createUser({
				email: formData.get('email') as string,
				password: hashedPassword,
			})
			toast.success('Вы успешно зарегистрировались')
			isRegistering && toggleFormType()
		} catch (error) {
			const err = error as Error
			console.error(err)
			if (err.message === 'User already exists') {
				toast.error('Пользователь с такой почтой уже существует')
			} else {
				toast.error('Произошла ошибка при регистрации')
			}
		}
	}

	const handleResetPasswordSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault()

		sendResetPasswordEmail(email)
		// Здесь должен быть ваш код для отправки запроса на восстановление пароля
		// Например, вызов функции sendResetPasswordEmail(email) или аналогичной
		toast.success('Письмо для восстановления пароля отправлено на вашу почту')
		setIsResettingPassword(false) // Возвращаемся к форме входа
	}

	const toggleFormType = () => {
		if (isResettingPassword) {
			setIsResettingPassword(false) // Вернуться к входу из состояния восстановления пароля
		} else {
			setIsRegistering(prevState => !prevState) // Переключиться между входом и регистрацией
		}
		setPassword('')
		setPasswordStrength(0)
		setShowPassword(false)
		setEmail('') // Очистить поле email при переключении
	}

	return (
		<div className={styles.Main}>
			<div className={`container w-50 pt-5 ${styles.Container}`}>
				<h1 className={`text-center ${styles.text_center}`}>
					{isRegistering
						? 'Регистрация'
						: isResettingPassword
						? 'Восстановление пароля'
						: 'Вход'}
				</h1>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<form
							onSubmit={
								isResettingPassword
									? handleResetPasswordSubmit
									: isRegistering
									? handleRegisterSubmit
									: handleLoginSubmit
							}
						>
							<div className='mb-3 pt-5'>
								<label className={`form-label ${styles.form_label}`}>
									Почта
								</label>
								<input
									type='email'
									name='email'
									className={`form-control ${styles.form_control}`}
									placeholder='Введите вашу почту'
									required
									value={email}
									onChange={handleEmailChange} // Обработчик для email
								/>
							</div>
							{!isResettingPassword && (
								<>
									<div className='mb-3'>
										<label className={`form-label ${styles.form_label}`}>
											Пароль
										</label>
										<div className='input-group'>
											<input
												type={showPassword ? 'text' : 'password'}
												name='password'
												className={`form-control ${styles.form_control}`}
												placeholder='Введите ваш пароль'
												value={password}
												onChange={handlePasswordChange}
												required
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
										{isRegistering && (
											<PasswordStrengthBar
												style={{ marginTop: '8px' }}
												scoreWordStyle={{ fontSize: '14px' }}
												password={password}
												onChangeScore={handlePasswordStrengthChange}
												minLength={8}
												shortScoreWord='Слишком короткий пароль'
												scoreWords={[
													'Очень слабый пароль',
													'Слабый пароль',
													'Нормальный пароль',
													'Сильный пароль',
													'Очень сильный пароль',
												]}
											/>
										)}
									</div>

									{isRegistering && (
										<div className='mb-3'>
											<label className={`form-label ${styles.form_label}`}>
												Подтвердите пароль
											</label>
											<div className='input-group'>
												<input
													type={showPassword ? 'text' : 'password'}
													name='confirmPassword'
													className={`form-control ${styles.form_control}`}
													placeholder='Повторите ваш пароль'
													required
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
									)}
								</>
							)}

							<div className='d-grid'>
								<button
									type='submit'
									className={`btn btn-primary ${styles.LoginButton}`}
									disabled={isRegistering && passwordStrength < 3}
									{...(isLoginSuccessful && { 'data-bs-dismiss': 'modal' })}
								>
									{isRegistering
										? 'Зарегистрироваться'
										: isResettingPassword
										? 'Отправить'
										: 'Войти'}
								</button>
							</div>
						</form>
						<div className='d-flex flex-column align-items-center'>
							<button
								type='button'
								className={`btn btn-link mt-4 ${styles.toggle_button}`}
								onClick={toggleFormType}
							>
								{isRegistering
									? 'Уже есть аккаунт? Войти'
									: isResettingPassword
									? 'Вернуться к входу'
									: 'Нет аккаунта? Зарегистрироваться'}
							</button>
							{!isRegistering && !isResettingPassword && (
								<button
									type='button'
									className={`btn btn-link mt-4 ${styles.toggle_button}`}
									onClick={() => setIsResettingPassword(true)} // Устанавливаем состояние для восстановления пароля
								>
									Забыли пароль?
								</button>
							)}
							<button
								type='button'
								className={`btn btn-link mt-4 d-flex align-items-center ${styles.toggle_button}`}
								onClick={() => router.push('/')}
							>
								<i className='bi bi-box-arrow-left pe-2 d-flex align-items-center'></i>
								На Главную
							</button>
						</div>
					</div>
				</div>
				<ToastContainer autoClose={1500} pauseOnFocusLoss={false} limit={3} />
			</div>
		</div>
	)
}
