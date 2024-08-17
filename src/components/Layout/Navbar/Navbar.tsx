'use client'

import LoginModalComponent from '@/components/LoginModal/LoginModal'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'
import LogoComponent from './LogoComponent'
import MobileToggle from './MobileToggle'
import NavLinks from './NavLinks'

const Navbar = () => {
	const [session, setSession] = useState<Session | null>(null)

	useEffect(() => {
		const fetchSession = async () => {
			const session = await getSession()
			setSession(session)
		}
		fetchSession()
	}, [])

	return (
		<nav className='navbar navbar-expand-lg navbar-light bg-light'>
			<div className='container'>
				<LogoComponent width={175} height={175} />
				<MobileToggle />
				<NavLinks session={session} />
				<div className='d-none d-lg-flex'>
					<LoginButton session={session} />
				</div>
			</div>
			<LoginModalComponent />
		</nav>
	)
}

export default Navbar
