import { getUser, updateUser } from '@/services/user.service'
import bcrypt from 'bcryptjs' // Импортируем bcryptjs
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './PasswordForm.module.css'

interface PasswordFormProps {
	adminPassword: string | null
	setAdminPassword: (password: string | null) => void
	setHasAccess: (hasAccess: boolean) => void
}

const PasswordForm: React.FC<PasswordFormProps> = ({
	adminPassword,
	setAdminPassword,
	setHasAccess,
}) => {
	const [inputPassword, setInputPassword] = useState<string>('')
	const [enteredPassword, setEnteredPassword] = useState<string>('')
	const router = useRouter()
	const [AdminPasswordFromBD, setAdminPasswordFromBD] = useState<string | null>(
		null
	)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const session = await getSession()
				const user = await getUser(Number(session?.user?.id))
				setAdminPasswordFromBD(user.data.admin_password)
			} catch (error) {
				console.error('Error fetching user:', error)
			}
		}
		fetchUser()
	}, [])

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const session = await getSession()
			const userId = session?.user?.id

			if (userId) {
				const hashed = await bcrypt.hash(inputPassword, 10)

				await updateUser(Number(userId), {
					...session?.user,
					id: Number(session?.user?.id),
					admin_password: hashed,
				})
				setAdminPassword(inputPassword)
				setHasAccess(true)
			} else {
				router.push('/')
				console.log('User session or ID not found during password creation')
			}
		} catch (error) {
			console.error('Error creating password:', error)
		}
	}

	const handlePasswordCheck = async (e: React.FormEvent) => {
		e.preventDefault()
		if (AdminPasswordFromBD) {
			const isMatch = await bcrypt.compare(
				enteredPassword,
				AdminPasswordFromBD || ''
			)
			if (isMatch) {
				setHasAccess(true)
			} else {
				alert('Неправильный пароль!')
			}
		} else {
			alert('Пароль еще не установлен!')
		}
	}

	return adminPassword === null ? (
		<div className={styles.Container}>
			<Image
				src={'http://localhost:3000/images/logo/logo_v1.svg'}
				alt=''
				width={250}
				height={250}
			/>
			<form className={styles.form} onSubmit={handlePasswordSubmit}>
				<input
					className={styles.Input}
					type='password'
					value={inputPassword}
					onChange={e => setInputPassword(e.target.value)}
					placeholder='Введите новый пароль'
				/>
				<button className={styles.Button} type='submit'>
					Создать пароль
				</button>
			</form>
		</div>
	) : (
		<div className={styles.Container}>
			<Image
				src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/logo_v1.svg`}
				alt=''
				width={250}
				height={250}
			/>
			<form className={styles.form} onSubmit={handlePasswordCheck}>
				<input
					className={styles.Input}
					type='password'
					value={enteredPassword}
					onChange={e => setEnteredPassword(e.target.value)}
					placeholder='Введите пароль'
				/>
				<button className={styles.Button} type='submit'>
					Войти
				</button>
			</form>
			<button
				className={styles.HomeButtonOutline}
				onClick={() => router.push('/')}
			>
				<i className='bi bi-box-arrow-left me-2'></i>
				На главную
			</button>
		</div>
	)
}

export default PasswordForm
