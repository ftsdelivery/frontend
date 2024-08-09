'use client'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { authService } from '@/services/auth.service'
import { IAuthForm } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LoginModal() {
	// Состояние для переключения между формами
	const [isLogin, setIsLogin] = useState(true)

	// Настройка react-hook-form
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange',
	})

	// Используем useRouter для перенаправления
	const { push } = useRouter()

	// Настройка useMutation для обработки формы
	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: async (data: IAuthForm) =>
			authService.main(isLogin ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Успешный вход!')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
		onError() {
			toast.error('Неверный логин или пароль!')
		},
	})

	// Обработчик отправки формы
	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	useEffect(() => {
		// Дополнительные действия при смене формы, если необходимо
		reset()
	}, [isLogin, reset])

	return (
		<div
			className='modal fade'
			id='loginModal'
			tabIndex={-1}
			aria-labelledby='loginModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='loginModalLabel'>
							{isLogin ? 'Войти в личный кабинет' : 'Регистрация'}
						</h5>
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='modal'
							aria-label='Close'
						></button>
					</div>
					<div className='modal-body'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='mb-3'>
								<label htmlFor='email' className='form-label'>
									Почта
								</label>
								<input
									type='email'
									className='form-control'
									id='email'
									placeholder='Введите вашу почту'
									{...register('email')}
								/>
							</div>
							<div className='mb-3'>
								<label htmlFor='password' className='form-label'>
									Пароль
								</label>
								<input
									type='password'
									className='form-control'
									id='password'
									placeholder='Введите ваш пароль'
									{...register('password')}
								/>
							</div>

							{/* Если это форма регистрации, добавим поле для подтверждения пароля */}
							{!isLogin && (
								<div className='mb-3'>
									<label htmlFor='confirmPassword' className='form-label'>
										Подтвердите пароль
									</label>
									<input
										type='password'
										className='form-control'
										id='confirmPassword'
										placeholder='Подтвердите ваш пароль'
									/>
								</div>
							)}
							<div className='modal-footer'>
								<button type='submit' className='btn btn-primary'>
									{isLogin ? 'Войти' : 'Зарегистрироваться'}
								</button>
							</div>
						</form>
						<button
							type='button'
							className='btn btn-link mt-3'
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin ? 'Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
						</button>
					</div>
				</div>
			</div>
			{/* Контейнер для отображения уведомлений */}
			<ToastContainer autoClose={3000} />
		</div>
	)
}
