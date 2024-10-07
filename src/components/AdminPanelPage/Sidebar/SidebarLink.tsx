// components/SidebarLink.tsx
import Link from 'next/link'
import styles from './Sidebar.module.css'

interface SidebarLinkProps {
	href: string
	icon: string
	label: string
	isCollapsed: boolean
	isActive: boolean
	onClick: () => void
	notificationCount?: number
	notificationCountTickets?: number // Добавляем это свойство
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
	href,
	icon,
	label,
	isCollapsed,
	isActive,
	onClick,
	notificationCount = 0,
	notificationCountTickets = 0,
}) => {
	return (
		<li className={`nav-item ${styles.nav_item}`}>
			<Link
				href={href}
				onClick={onClick}
				className={`nav-link text-white fles-direction-row d-flex  ${
					isActive ? 'active' : ''
				} ${styles.flex_grow}`}
			>
				{isCollapsed && <i className={`bi ${icon}`}></i>}
				{!isCollapsed && <i className={`bi ${icon} me-2`}></i>}
				{!isCollapsed && (
					<>
						{label}
						{notificationCount > 0 && (
							<span className='badge d-flex text-bg-danger ms-3 align-items-center'>
								{notificationCount}
							</span>
						)}
						{notificationCountTickets > 0 && ( // Отображаем количество тикетов
							<span className='badge d-flex text-bg-danger ms-3 align-items-center'>
								{notificationCountTickets}
							</span>
						)}
					</>
				)}
			</Link>
		</li>
	)
}

export default SidebarLink
