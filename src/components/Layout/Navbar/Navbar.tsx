'use client'

import Logo from '@/../../public/logo/logo_v1.svg'
import LoginModalComponent from '@/components/LoginModal/LoginModal'
import { getAccessToken } from '@/services/auth-token.service'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
	const token = getAccessToken()
	const router = useRouter()
	return (
		<nav className='navbar navbar-expand-lg navbar-light bg-light'>
			<div className='container'>
				{/* Логотип */}
				<a className='navbar-brand' href='#'>
					<Image src={Logo} alt='Logo' width={175} height={125} />
				</a>

				{/* Кнопка для мобильного меню */}
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>

				{/* Ссылки */}
				<div
					className='collapse navbar-collapse justify-content-center'
					id='navbarNav'
				>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<a className={`nav-link ${styles.navLink}`} href='#news'>
								Новости
							</a>
						</li>
						<li className='nav-item'>
							<a className={`nav-link ${styles.navLink}`} href='#apply'>
								Как подать заявку?
							</a>
						</li>
						<li className='nav-item'>
							<a className={`nav-link ${styles.navLink}`} href='#about'>
								О Компании
							</a>
						</li>
						<li className='nav-item'>
							<a className={`nav-link ${styles.navLink}`} href='#support'>
								Поддержка
							</a>
						</li>
						<li className='nav-item'>
							<a className={`nav-link ${styles.SubmitButon}`} href='#submit'>
								Подать заявку
							</a>
						</li>

						{/* Кнопка "Войти" только для мобильного меню */}

						<li className={`nav-item d-lg-none`}>
							<button
								className={`btn btn-primary w-100 mt-3 ${styles.MobileLoginButton}`}
								type='button'
								data-bs-toggle='modal'
								data-bs-target='#loginModal'
							>
								Личный кабинет
							</button>
						</li>
					</ul>
				</div>
				<div className='d-none d-lg-flex'>
					<button
						className={`btn btn-primary ${styles.LoginButton}`}
						type='button'
						data-bs-toggle='modal'
						data-bs-target='#loginModal'
					>
						Личный кабинет
					</button>
				</div>
			</div>

			{/* Подключаем модальное окно */}
			<LoginModalComponent />
		</nav>
	)
}
