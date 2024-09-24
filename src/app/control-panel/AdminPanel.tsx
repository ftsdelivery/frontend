'use client'

import Sidebar from '@/components/AdminPanelPage/Sidebar/Sidebar'
import Loader from '@/components/ui/Loader/Loader'
import { getUser } from '@/services/user.service'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './AdminPanel.module.css'
import ContentManager from './ContentManager'
import PasswordForm from './PasswordForm'

export default function AdminPanel() {
	const [content, setContent] = useState('statistic')
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
	const [loading, setLoading] = useState(true)
	const [adminPassword, setAdminPassword] = useState<string | null>(null)
	const [hasAccess, setHasAccess] = useState<boolean>(false)
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
	const router = useRouter()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const session = await getSession()
				const userId = session?.user?.id

				if (userId) {
					const user = await getUser(Number(userId))

					if (
						user.data.role !== 'ADMINISTRATOR' &&
						user.data.role !== 'MANAGER'
					) {
						router.push('/')
					} else {
						setAdminPassword(user.data.admin_password)
						setIsAdmin(true)
					}
				} else {
					router.push('/')
				}
			} catch (error) {
				console.error('Error fetching user:', error)
				router.push('/')
			}

			setLoading(false)
		}

		fetchUser()
	}, [])

	const handleSidebarToggle = (collapsed: boolean) => {
		setIsSidebarCollapsed(collapsed)
		document.documentElement.style.setProperty(
			'--sidebar-width',
			collapsed ? '4rem' : '250px'
		)
		document.documentElement.style.setProperty(
			'--content-padding',
			collapsed ? '4rem' : '250px'
		)
	}
	if (loading || isAdmin === null) {
		return <Loader />
	}
	return (
		<div className={`d-flex vh-100 ${styles.container}`}>
			{!hasAccess ? (
				<PasswordForm
					adminPassword={adminPassword}
					setAdminPassword={setAdminPassword}
					setHasAccess={setHasAccess}
				/>
			) : (
				<>
					<Sidebar onButtonClick={setContent} onToggle={handleSidebarToggle} />
					<div className={`flex-grow-1 ${styles.contentWrapper}`}>
						<div className={`p-3 ${styles.content}`}>
							<ContentManager content={content} />
						</div>
					</div>
				</>
			)}
		</div>
	)
}
