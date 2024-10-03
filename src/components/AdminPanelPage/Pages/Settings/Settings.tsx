import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import GeneralSettings from './GeneralSettings'
import Roles from './News/News'
import NotificationSettings from './NotificationSettings'
import Warehouses from './Warehouses'

const Settings = () => {
	const [activeTab, setActiveTab] = useState('warehouses')
	const router = useRouter()

	useEffect(() => {
		// Проверяем значение хэша при загрузке компонента
		const hash = window.location.hash
		console.log('hash:', hash)
		if (hash === '#settings#news') {
			setActiveTab('roles') // Установите активную вкладку на 'roles' (новости)
		} else if (hash === '#settings#warehouses') {
			setActiveTab('warehouses')
		} else {
			setActiveTab('warehouses') // Установите значение по умолчанию для других случаев
		}
	}, []) // Пустой массив зависимостей, чтобы запустить эффект только при монтировании компонента

	return (
		<div>
			<h1>Настройки</h1>
			<ul className='nav nav-tabs mt-4'>
				{/* <li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
						onClick={() => setActiveTab('general')}
					>
						Общие
					</button>
				</li> */}
				<li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'warehouses' ? 'active' : ''}`}
						onClick={() => {
							setActiveTab('warehouses')
							router.push('/control-panel#settings#warehouses')
						}}
					>
						Склады
					</button>
				</li>
				<li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
						onClick={() => {
							setActiveTab('roles')
							router.push('/control-panel#settings#news')
						}}
					>
						Новости
					</button>
				</li>

				{/* <li className='nav-item'>
					<button
						className={`nav-link ${
							activeTab === 'notifications' ? 'active' : ''
						}`}
						onClick={() => setActiveTab('notifications')}
					>
						Уведомления
					</button>
				</li> */}
			</ul>
			<div className='tab-content'>
				{activeTab === 'general' && <GeneralSettings />}
				{activeTab === 'warehouses' && <Warehouses />}
				{activeTab === 'roles' && <Roles />}
				{activeTab === 'notifications' && <NotificationSettings />}
			</div>
		</div>
	)
}

export default Settings
