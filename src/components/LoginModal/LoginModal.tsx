import { createUser, getUserByEmail } from '@/services/user.service'
import bcrypt from 'bcryptjs' // Импортируем bcrypt
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import PasswordStrengthBar from 'react-password-strength-bar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './LoginModal.module.css'

export default function SignInForm() {
	const [isRegistering, setIsRegistering] = useState(false)
	const [password, setPassword] = useState('')
	const [passwordStrength, setPasswordStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(false)
	const [isLoginSuccessful, setIsLoginSuccessful] = useState(false)
	const router = useRouter()

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
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
			// Предполагается, что у вас есть функция `getUserByEmail`, которая ищет пользователя в базе данных по email
			const user = await getUserByEmail(email)

			if (user === null) {
				toast.error('Пользователь с таким email не найден')
				return
			}
			console.log(user.password)
			// Сравнение введённого пароля с хешированным паролем из базы данных
			const isPasswordValid = await bcrypt.compare(password, user.password)
			console.log(isPasswordValid)
			if (!isPasswordValid) {
				toast.error('Неправильный пароль')
				return
			}

			// Если пароль совпадает, выполняем вход
			const res = await signIn('credentials', {
				email: email,
				password: user.password,
				redirect: false,
			})

			if (res && !res.error) {
				toast.success('Вы успешно вошли в систему')
				setIsLoginSuccessful(true)
				const modalElement = document.getElementById('loginModal')
				if (modalElement) {
					modalElement.classList.remove('show')
					modalElement.style.display = 'none'
					document.body.classList.remove('modal-open')
					const modalBackdrop = document.querySelector('.modal-backdrop')
					if (modalBackdrop) {
						modalBackdrop.remove()
					}
				}
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
			// Хэшируем пароль перед его сохранением
			const hashedPassword = await bcrypt.hash(password, 10)

			await createUser({
				email: formData.get('email') as string,
				password: hashedPassword, // Используем зашифрованный пароль
			})
			toast.success('Вы успешно зарегистрировались')
			isRegistering && toggleFormType()
		} catch (error) {
			const err = error as Error
			console.error(err)
			if (err.message === 'User already exists') {
				toast.error('Пользователь с таким email уже существует')
			} else {
				toast.error('Произошла ошибка при регистрации')
			}
		}
	}

	const toggleFormType = () => {
		setIsRegistering(prevState => !prevState)
		setPassword('')
		setPasswordStrength(0)
		setShowPassword(false)
	}

	return (
		<div
			className={`modal fade ${styles.ModalMain}`}
			id='loginModal'
			tabIndex={-1}
			aria-labelledby='loginModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='loginModalLabel'>
							{isRegistering ? 'Регистрация' : 'Вход'}
						</h5>
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='modal'
							aria-label='Close'
						></button>
					</div>
					<div className='modal-body'>
						<form
							onSubmit={
								isRegistering ? handleRegisterSubmit : handleLoginSubmit
							}
						>
							<div className='mb-3'>
								<label className='form-label'>Почта</label>
								<input
									type='email'
									name='email'
									className='form-control'
									placeholder='Введите вашу почту'
									required
								/>
							</div>
							<div className='mb-3'>
								<label className='form-label'>Пароль</label>
								<div className='input-group'>
									<input
										type={showPassword ? 'text' : 'password'}
										name='password'
										className='form-control'
										placeholder='Введите ваш пароль'
										value={password}
										onChange={handlePasswordChange}
										required
									/>
									<span
										className='input-group-text'
										onClick={toggleShowPassword}
										style={{ cursor: 'pointer' }}
									>
										<i
											className={`bi ${
												showPassword ? 'bi-eye-slash' : 'bi-eye'
											}`}
										></i>{' '}
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
									<label className='form-label'>Подтверждение пароля</label>
									<div className='input-group'>
										<input
											type={showPassword ? 'text' : 'password'}
											name='confirmPassword'
											className='form-control'
											placeholder='Повторите ваш пароль'
											required
										/>
										<span
											className='input-group-text'
											onClick={toggleShowPassword}
											style={{ cursor: 'pointer' }}
										>
											<i
												className={`bi ${
													showPassword ? 'bi-eye-slash' : 'bi-eye'
												}`}
											></i>{' '}
										</span>
									</div>
								</div>
							)}

							<div className='modal-footer p-0 border-0'>
								<button
									type='submit'
									className='btn btn-primary w-100'
									disabled={isRegistering && passwordStrength < 3}
									{...(isLoginSuccessful && { 'data-bs-dismiss': 'modal' })}
								>
									{isRegistering ? 'Зарегистрироваться' : 'Войти'}
								</button>
							</div>
						</form>
						<button
							type='button'
							className='btn btn-link mt-3'
							onClick={toggleFormType}
						>
							{isRegistering
								? 'Уже есть аккаунт? Войти'
								: 'Нет аккаунта? Зарегистрироваться'}
						</button>
					</div>
					<ToastContainer autoClose={1500} pauseOnFocusLoss={false} limit={3} />
				</div>
			</div>
		</div>
	)
}
