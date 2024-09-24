import { Session } from 'next-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

const NavLinks = ({ session }: { session: Session | null }) => {
	const router = useRouter()
	return (
		<div
			className='collapse navbar-collapse justify-content-center'
			id='navbarNav'
		>
			<ul className='navbar-nav'>
				<li className='nav-item'>
					<Link className={`nav-link ${styles.navLink}`} href='/#news'>
						Новости
					</Link>
				</li>
				<li className='nav-item'>
					<Link className={`nav-link ${styles.navLink}`} href='/#faq'>
						FAQ
					</Link>
				</li>
				<li className='nav-item'>
					<Link className={`nav-link ${styles.navLink}`} href='/#feedbacks'>
						Отзывы
					</Link>
				</li>
				<li className='nav-item'>
					<Link className={`nav-link ${styles.navLink}`} href='/#about'>
						О нас
					</Link>
				</li>
				<li className='nav-item'>
					<Link className={`nav-link ${styles.navLink}`} href='/support'>
						Поддержка
					</Link>
				</li>
				<li className='nav-item'>
					<a className={`nav-link ${styles.SubmitButon}`} href='/#submit'>
						Подать заявку
					</a>
				</li>
				<li className={`nav-item d-lg-none`}>
					{session ? (
						<button
							className={`btn btn-primary w-100 mt-3 ${styles.MobileLoginButton}`}
							onClick={() => router.push('/account')}
						>
							Личный кабинет
						</button>
					) : (
						<button
							className={`btn btn-primary w-100 mt-3 ${styles.MobileLoginButton}`}
							type='button'
							onClick={() => router.push('/signin')}
						>
							Личный кабинет
						</button>
					)}
				</li>
			</ul>
		</div>
	)
}

export default NavLinks
