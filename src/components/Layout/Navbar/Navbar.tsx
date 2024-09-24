'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LoginButton from './LoginButton'
import MobileToggle from './MobileToggle'
import NavLinks from './NavLinks'
import styles from './Navbar.module.css'

const Navbar = () => {
	const { data: session } = useSession()
	const router = useRouter()
	return (
		<nav className={`navbar navbar-expand-lg ${styles.NavBar}`}>
			<div className={`container ${styles.Container}`}>
				<a
					className='navbar-brand mt-3'
					style={{ cursor: 'pointer' }}
					onClick={() => router.push('/')}
				>
					<Image
						src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/logo_v1.svg`}
						alt='Logo'
						width={125}
						height={125}
					/>
				</a>
				<MobileToggle />
				<NavLinks session={session} />
				<div className='d-none d-lg-flex'>
					<LoginButton />
				</div>
			</div>
		</nav>
	)
}

export default Navbar
