import { getAllOrders } from '@/services/order.service'
import { getUsers } from '@/services/user.service'
import React, { useEffect, useMemo, useState } from 'react'
import DeliveryPercentChart from './DeliveryPercentChart'
import OrderChart from './OrderChart'
import OrderStatsCard from './OrderStatsCard'
import UserStatsCard from './UserStatsCard'

const Statistic: React.FC = () => {
	const [orderData, setOrderData] = useState<{
		allTime: number
		thisMonth: number
		thisWeek: number
		today: number
	}>({
		allTime: 0,
		thisMonth: 0,
		thisWeek: 0,
		today: 0,
	})

	const [deliveryPercent, setDeliveryPercent] = useState<number>(0)
	const [userStats, setUserStats] = useState<{
		activeUsers: number
		newUsers: number
	}>({
		activeUsers: 0,
		newUsers: 0,
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [ordersResponse, usersResponse] = await Promise.all([
					getAllOrders(),
					getUsers(),
				])

				const orders = ordersResponse.data || []
				const now = new Date()
				const today = now.toISOString().slice(0, 10)
				const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

				const counts = {
					allTime: orders.length,
					thisMonth: orders.filter(
						(order: any) =>
							new Date(order.created_at).getMonth() === now.getMonth()
					).length,
					thisWeek: orders.filter(
						(order: any) => new Date(order.created_at) >= startOfWeek
					).length,
					today: orders.filter(
						(order: any) => order.created_at.slice(0, 10) === today
					).length,
				}

				setOrderData(counts)

				const deliveredOrders = orders.filter(
					(order: any) => order.status === 'DELIVERED'
				).length
				setDeliveryPercent((deliveredOrders / orders.length) * 100 || 0)

				const users = usersResponse.data || []
				const activeUsers = users.length
				const newUsers = users.filter(
					(user: any) =>
						new Date(user.created_at).toISOString().slice(0, 10) === today
				).length

				setUserStats({
					activeUsers,
					newUsers,
				})
			} catch (error) {
				console.error('Ошибка получения данных:', error)
			}
		}

		fetchData()
	}, [])

	// Мемоизация данных для графиков и карт
	const orderStats = useMemo(
		() => ({
			allTime: orderData.allTime,
			thisMonth: orderData.thisMonth,
			thisWeek: orderData.thisWeek,
			today: orderData.today,
		}),
		[orderData]
	)

	const deliveryPercentage = useMemo(() => deliveryPercent, [deliveryPercent])
	const userStatistics = useMemo(
		() => ({
			activeUsers: userStats.activeUsers,
			newUsers: userStats.newUsers,
		}),
		[userStats]
	)

	return (
		<div className='container mt-5'>
			<div className='row'>
				<OrderStatsCard
					title='Общее количество заявок'
					value={orderStats.allTime}
					bgColor='primary'
					icon='bi bi-box'
				/>
				<OrderStatsCard
					title='Заявки за этот месяц'
					value={orderStats.thisMonth}
					bgColor='success'
					icon='bi bi-calendar-month'
				/>
				<UserStatsCard
					title='Активные пользователи'
					value={userStatistics.activeUsers}
					bgColor='warning'
					icon='bi bi-person'
				/>
				<UserStatsCard
					title='Новые пользователи'
					value={userStatistics.newUsers}
					bgColor='danger'
					icon='bi bi-person-plus'
				/>
			</div>
			<div className='row mt-4'>
				<OrderChart data={orderStats} />
				<DeliveryPercentChart />
			</div>
		</div>
	)
}

export default Statistic
