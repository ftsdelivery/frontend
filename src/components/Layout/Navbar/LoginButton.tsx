import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

const LoginButton = ({ session }: { session: Session | null }) => {
	const router = useRouter()

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
			type='button'
			onClick={() => router.push('/signin')}
		>
			Личный кабинет
		</button>
	)
}

export default LoginButton
