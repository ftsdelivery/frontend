import { useState } from 'react'
import GeneralSettings from './GeneralSettings'
import NotificationSettings from './NotificationSettings'
import Roles from './Roles'
import Warehouses from './Warehouses'

const Settings = () => {
	const [activeTab, setActiveTab] = useState('general')

	return (
		<div>
			<h1>Настройки</h1>
			<ul className='nav nav-tabs mt-4'>
				<li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
						onClick={() => setActiveTab('general')}
					>
						Общие
					</button>
				</li>
				<li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'warehouses' ? 'active' : ''}`}
						onClick={() => setActiveTab('warehouses')}
					>
						Склады
					</button>
				</li>
				<li className='nav-item'>
					<button
						className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
						onClick={() => setActiveTab('roles')}
					>
						Роли
					</button>
				</li>

				<li className='nav-item'>
					<button
						className={`nav-link ${
							activeTab === 'notifications' ? 'active' : ''
						}`}
						onClick={() => setActiveTab('notifications')}
					>
						Уведомления
					</button>
				</li>
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
