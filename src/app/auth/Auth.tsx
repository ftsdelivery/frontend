'use client'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { authService } from '@/services/auth.service'
import { IAuthForm } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './Auth.module.css'

export function Auth() {
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange',
	})

	const [isLoginForm, setIsLoginForm] = useState(false)

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: async (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Успешный вход!')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
		onError() {
			toast.error('Неверный логин или пароль!')
		},
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<div className={styles['auth-container']}>
			<form className={styles['auth-form']} onSubmit={handleSubmit(onSubmit)}>
				<input
					className={styles['auth-form__input']}
					type='email'
					{...register('email')}
					placeholder='Email'
				/>
				<input
					className={styles['auth-form__input']}
					type='password'
					{...register('password')}
					placeholder='Password'
				/>
				<button className={styles['auth-form__button']} type='submit'>
					{isLoginForm ? 'Login' : 'Register'}
				</button>
			</form>
			<button
				className={styles['auth-switch-button']}
				onClick={() => setIsLoginForm(!isLoginForm)}
			>
				{isLoginForm ? 'Switch to Register' : 'Switch to Login'}
			</button>
			<ToastContainer autoClose={3000} />
		</div>
	)
}
