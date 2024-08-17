'use client'

import {
	OrderCreate,
	OrderEdit,
	OrderList,
	OrderShow,
} from '@/components/AdminPanel/ordersList'
import {
	PromoCodeCreate,
	PromoCodeEdit,
	PromoCodeShow,
	PromoCodesList,
} from '@/components/AdminPanel/promocodesList'
import Status from '@/components/AdminPanel/Status'
import themes from '@/components/AdminPanel/themes'
import {
	UserEdit,
	UserShow,
	UsersList,
} from '@/components/AdminPanel/usersProvider'
import { dataProvider } from '@/lib/DataProvider'
import 'bootstrap-icons/font/bootstrap-icons.css' // Подключение Bootstrap Icons
import polyglotI18nProvider from 'ra-i18n-polyglot'
import { useEffect, useState } from 'react'
import {
	Admin,
	CustomRoutes,
	EditGuesser,
	ListGuesser,
	Resource,
	ShowGuesser,
} from 'react-admin'
import { Route } from 'react-router-dom'

// Компоненты для иконок
const OrdersIcon = () => <i className='bi bi-clipboard-check'></i>
const PeopleIcon = () => <i className='bi bi-people-fill'></i>
const TagIcon = () => <i className='bi bi-tag-fill'></i>
const TicketIcon = () => <i className='bi bi-ticket-perforated-fill'></i>
const NewspaperIcon = () => <i className='bi bi-newspaper'></i>

import AdminDashBoard from '@/components/AdminPanel/Dashboard'
import russianMessages from 'ra-language-russian'
// Импорт ваших ресурсов и провайдеров

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru')

export default function AdminPage() {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	if (!isClient) {
		return null
	}

	return (
		<Admin
			dataProvider={dataProvider}
			dashboard={AdminDashBoard}
			i18nProvider={i18nProvider}
			{...themes}
		>
			<Resource
				name='orders'
				icon={OrdersIcon} // Использование компонента иконки
				list={OrderList}
				edit={OrderEdit}
				show={OrderShow}
				create={OrderCreate}
				options={{ label: 'Заявки' }}
			/>
			<Resource
				name='users'
				icon={PeopleIcon} // Использование компонента иконки
				list={UsersList}
				edit={UserEdit}
				show={UserShow}
				options={{ label: 'Пользователи' }}
			/>
			<Resource
				name='promocodes'
				icon={TagIcon} // Использование компонента иконки
				list={PromoCodesList}
				edit={PromoCodeEdit}
				show={PromoCodeShow}
				create={PromoCodeCreate}
				options={{ label: 'Промокоды' }}
			/>
			<Resource
				name='tickets'
				icon={TicketIcon} // Использование компонента иконки
				list={ListGuesser}
				edit={EditGuesser}
				show={ShowGuesser}
				options={{ label: 'Поддержка' }}
			/>
			<Resource
				name='news'
				icon={NewspaperIcon} // Использование компонента иконки
				list={ListGuesser}
				edit={EditGuesser}
				show={ShowGuesser}
				options={{ label: 'Новости' }}
			/>
			<CustomRoutes>
				<Route path='/status' element={<Status />} />
			</CustomRoutes>
		</Admin>
	)
}
