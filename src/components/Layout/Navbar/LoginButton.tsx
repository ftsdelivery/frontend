import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

const LoginButton = () => {
	const router = useRouter()
	const { data: session, status } = useSession()

	if (status === 'loading') {
		return (
			<div
				className={`${styles.LoaderContainer} d-flex align-items-center justify-content-center`}
			>
				<div className={styles.loader}></div>
			</div>
		)
	}

	return session ? (
		<button
			className={`btn ${styles.LoginButton}`}
			onClick={() => router.push('/account')}
		>
			Личный кабинет
		</button>
	) : (
		<button
			className={`btn ${styles.LoginButton}`}
			onClick={() => router.push('/signin')}
		>
			Личный кабинет
		</button>
	)
}

export default LoginButton
