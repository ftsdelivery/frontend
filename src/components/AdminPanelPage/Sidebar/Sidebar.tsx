import { getPendingOrdersCount } from '@/services/order.service'
import { getTicketsCount } from '@/services/ticket.service'
import { getUser } from '@/services/user.service'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Sidebar.module.css'
import SidebarLink from './SidebarLink'

const Sidebar = ({ onButtonClick }: any) => {
	const sidebarRef = useRef<HTMLDivElement>(null)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [activeLink, setActiveLink] = useState(1)
	const [notificationCount, setNotificationCount] = useState(0)
	const [notificationCountTickets, setNotificationCountTickets] = useState(0)
	const [role, setRole] = useState('')
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const { data: session } = useSession()

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				window.innerWidth <= 768 &&
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsCollapsed(true)
				document.documentElement.style.setProperty('--sidebar-width', '4rem')
				document.documentElement.style.setProperty('--content-padding', '100px')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		const fetchUser = async () => {
			if (session?.user) {
				try {
					const user = await getUser(Number(session.user.id))
					setRole(user.data.role)
					setLoading(false)
				} catch (error) {
					console.error('Error fetching user:', error)
					setLoading(false)
				}
			}
		}

		fetchUser()
	}, [session])

	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth <= 768
			setIsCollapsed(isMobile)
			document.documentElement.style.setProperty(
				'--sidebar-width',
				isMobile ? '4rem' : '250px'
			)
			document.documentElement.style.setProperty(
				'--content-padding',
				isMobile ? '100px' : '300px'
			)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const fetchPendingOrdersCount = async () => {
			try {
				const count = await getPendingOrdersCount()
				setNotificationCount(count)
			} catch (error) {
				console.error('Error fetching pending orders count:', error)
			}
		}

		fetchPendingOrdersCount()
	}, [])

	useEffect(() => {
		const fetchTicketsCount = async () => {
			try {
				const count = await getTicketsCount()
				setNotificationCountTickets(count)
			} catch (error) {
				console.error('Error fetching tickets count:', error)
			}
		}
		fetchTicketsCount()
	}, [])

	const toggleSidebar = () => {
		const newState = !isCollapsed
		setIsCollapsed(newState)
		document.documentElement.style.setProperty(
			'--sidebar-width',
			newState ? '4rem' : '250px'
		)
		document.documentElement.style.setProperty(
			'--content-padding',
			newState ? '100px' : '300px'
		)
	}

	const handleLinkClick = (content: any, linkIndex: any) => {
		onButtonClick(content)
		setActiveLink(linkIndex)
	}

	const handleHomeButtonClick = () => {
		router.push('/')
	}

	const allLinks = [
		{
			href: '#statistic',
			icon: 'bi-bar-chart-fill',
			label: 'Статистика',
			content: 'statistic',
			index: 1,
			separator: true,
		},
		{
			href: '#orders',
			icon: 'bi-file-earmark-text-fill',
			label: 'Заявки',
			content: 'orders',
			index: 2,
		},
		{
			href: '#support',
			icon: 'bi-headset',
			label: 'Поддержка',
			content: 'support',
			index: 3,
		},
		{
			href: '#promocodes',
			icon: 'bi-tags-fill',
			label: 'Промокоды',
			content: 'promo',
			index: 4,
			separator: true,
		},
		{
			href: '#users',
			icon: 'bi-people-fill',
			label: 'Пользователи',
			content: 'users',
			index: 5,
		},
		{
			href: '#settings',
			icon: 'bi-gear-fill',
			label: 'Настройки',
			content: 'settings',
			index: 6,
			separator: true,
		},
		{
			href: '#logs',
			icon: 'bi-file-earmark-text',
			label: 'Логи',
			content: 'logs',
			index: 7,
		},
	]

	const filteredLinks =
		role === 'ADMINISTRATOR'
			? allLinks
			: allLinks.filter(link =>
					['statistic', 'orders', 'support', 'promo'].includes(link.content)
			  )

	const placeholders = new Array(filteredLinks.length).fill(null)

	return (
		<div
			ref={sidebarRef}
			className={`d-flex flex-column p02 ${styles.sidebar}`}
			style={{
				width: 'var(--sidebar-width)',
				height: '100vh',
				transition: 'width 0.3s',
			}}
		>
			<div className='d-flex flex-column flex-grow-1'>
				<button className='btn btn-dark mb-3' onClick={toggleSidebar}>
					<i className={`bi ${isCollapsed ? 'bi-list' : 'bi-x-lg'}`} />
				</button>
				<div className={styles['sidebar-links']}>
					<ul className='nav nav-pills flex-column'>
						{loading ? (
							<div>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<li className={`nav-item ${styles.separator}`}></li>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<li className={`nav-item ${styles.separator}`}></li>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<p className='placeholder-glow'>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
								<li className={`nav-item ${styles.separator}`}></li>
								<p
									className='placeholder-glow'
									style={{ height: '35px', borderRadius: '8px' }}
								>
									<span
										className='placeholder col-12'
										style={{ height: '35px', borderRadius: '8px' }}
									></span>
								</p>
							</div>
						) : (
							filteredLinks.map((link: any) => (
								<React.Fragment key={link.index}>
									<SidebarLink
										href={link.href}
										icon={link.icon}
										label={link.label}
										isCollapsed={isCollapsed}
										isActive={activeLink === link.index}
										onClick={() => handleLinkClick(link.content, link.index)}
										notificationCount={
											link.index === 2 ? notificationCount : undefined
										}
										notificationCountTickets={
											link.index === 3 ? notificationCountTickets : undefined
										}
									/>
									{link.separator && (
										<li className={`nav-item ${styles.separator}`}></li>
									)}
								</React.Fragment>
							))
						)}
					</ul>
				</div>
			</div>
			<button
				className={`btn btn-primary ${styles.homeButton}`}
				onClick={handleHomeButtonClick}
			>
				<i className='bi bi-house-door' />{' '}
				<span className={`${isCollapsed ? 'd-none' : 'ms-2'}`}>На главную</span>
			</button>
		</div>
	)
}

export default Sidebar
