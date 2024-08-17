import { getAllOrders } from '@/services/order.service'
import { getPromoCodes } from '@/services/promo_codes.service'
import { getUsers } from '@/services/user.service'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface Order {
	id: number
	status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED'
	created_at: string
	updated_at: string
	ip: string
	marketPlace: string
	warehouse: string
	delivery_type: string
	quantity: string
	extra_services: string
	pickup_date: string
	pickup_time: string
	pickup_address: string
	contact_info: string
	comment: string
	promo_code: string
	order_price: number
	user_id: number | null
}

interface User {
	id: number
	created_at: string
	updated_at: string
	email: string
	name: string | null
	role: 'ADMIN' | 'USER'
	orders_count: number
}

interface PromoCode {
	id: number
	created_at: string
	updated_at: string
	code: string
	discount: number
	is_active: boolean
	author_id: number
	count_of_uses: number
	limit_of_uses: number
}

interface Stats {
	totalOrders: number
	ordersLastMonth: number
	ordersLastWeek: number
	ordersLastDay: number
	totalUsers: number
	usersLastMonth: number
	usersLastWeek: number
	usersLastDay: number
	totalTickets: number
	ticketsLastMonth: number
	ticketsLastWeek: number
	ticketsLastDay: number
	promoCodesUsage: { name: string; usage: number }[]
	orderStatuses: {
		pending: number
		confirmed: number
		cancelled: number
		delivered: number
	}
}

const Dashboard: React.FC = () => {
	const [stats, setStats] = useState<Stats>({
		totalOrders: 0,
		ordersLastMonth: 0,
		ordersLastWeek: 0,
		ordersLastDay: 0,
		totalUsers: 0,
		usersLastMonth: 0,
		usersLastWeek: 0,
		usersLastDay: 0,
		totalTickets: 0, // Нужно будет заменить при наличии данных о тикетах
		ticketsLastMonth: 0,
		ticketsLastWeek: 0,
		ticketsLastDay: 0,
		promoCodesUsage: [],
		orderStatuses: {
			pending: 0,
			confirmed: 0,
			cancelled: 0,
			delivered: 0,
		},
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [ordersData, usersData, promoCodesData] = await Promise.all([
					getAllOrders() as Promise<{ data: Order[] }>,
					getUsers() as Promise<{ data: User[] }>,
					getPromoCodes() as Promise<{ data: PromoCode[] }>,
				])

				const orders = ordersData.data
				const users = usersData.data
				const promoCodes = promoCodesData.data

				// Подсчет статистики для заказов
				const now = new Date()
				const ordersLastMonth = orders.filter(
					order =>
						new Date(order.created_at) >=
						new Date(now.setMonth(now.getMonth() - 1))
				).length
				const ordersLastWeek = orders.filter(
					order =>
						new Date(order.created_at) >=
						new Date(now.setDate(now.getDate() - 7))
				).length
				const ordersLastDay = orders.filter(
					order =>
						new Date(order.created_at) >=
						new Date(now.setDate(now.getDate() - 1))
				).length

				// Подсчет статистики для пользователей
				const usersLastMonth = users.filter(
					user =>
						new Date(user.created_at) >=
						new Date(now.setMonth(now.getMonth() - 1))
				).length
				const usersLastWeek = users.filter(
					user =>
						new Date(user.created_at) >=
						new Date(now.setDate(now.getDate() - 7))
				).length
				const usersLastDay = users.filter(
					user =>
						new Date(user.created_at) >=
						new Date(now.setDate(now.getDate() - 1))
				).length

				// Подсчет использования промокодов
				const promoCodesUsage = promoCodes.map(code => ({
					name: code.code,
					usage: code.count_of_uses,
				}))

				// Подсчет заявок по статусам
				const orderStatuses = {
					pending: orders.filter(order => order.status === 'PENDING').length,
					confirmed: orders.filter(order => order.status === 'CONFIRMED')
						.length,
					cancelled: orders.filter(order => order.status === 'CANCELLED')
						.length,
					delivered: orders.filter(order => order.status === 'DELIVERED')
						.length,
				}

				setStats({
					totalOrders: orders.length,
					ordersLastMonth,
					ordersLastWeek,
					ordersLastDay,
					totalUsers: users.length,
					usersLastMonth,
					usersLastWeek,
					usersLastDay,
					totalTickets: 0,
					ticketsLastMonth: 0,
					ticketsLastWeek: 0,
					ticketsLastDay: 0,
					promoCodesUsage,
					orderStatuses,
				})
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<Grid container spacing={2}>
			{/* Общая статистика по заявкам */}
			<Grid item xs={12} md={4}>
				<Card>
					<CardContent>
						<Typography variant='h6'>Общее количество заявок</Typography>
						<Typography variant='h4'>{stats.totalOrders}</Typography>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart
								data={[
									{ name: 'День', value: stats.ordersLastDay },
									{ name: 'Неделя', value: stats.ordersLastWeek },
									{ name: 'Месяц', value: stats.ordersLastMonth },
								]}
							>
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<CartesianGrid stroke='#f5f5f5' />
								<Line type='monotone' dataKey='value' stroke='#ff7300' />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Grid>

			{/* Статистика по пользователям */}
			<Grid item xs={12} md={4}>
				<Card>
					<CardContent>
						<Typography variant='h6'>Общее количество пользователей</Typography>
						<Typography variant='h4'>{stats.totalUsers}</Typography>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart
								data={[
									{ name: 'День', value: stats.usersLastDay },
									{ name: 'Неделя', value: stats.usersLastWeek },
									{ name: 'Месяц', value: stats.usersLastMonth },
								]}
							>
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<CartesianGrid stroke='#f5f5f5' />
								<Line type='monotone' dataKey='value' stroke='#387908' />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Grid>

			{/* Статистика по тикетам (запросам в поддержку) */}
			<Grid item xs={12} md={4}>
				<Card>
					<CardContent>
						<Typography variant='h6'>
							Общее количество запросов в поддержку
						</Typography>
						<Typography variant='h4'>{stats.totalTickets}</Typography>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart
								data={[
									{ name: 'День', value: stats.ticketsLastDay },
									{ name: 'Неделя', value: stats.ticketsLastWeek },
									{ name: 'Месяц', value: stats.ticketsLastMonth },
								]}
							>
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<CartesianGrid stroke='#f5f5f5' />
								<Line type='monotone' dataKey='value' stroke='#8884d8' />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Grid>

			{/* Статистика использования промокодов */}
			<Grid item xs={12} md={6}>
				<Card>
					<CardContent>
						<Typography variant='h6'>Использование промокодов</Typography>
						<ResponsiveContainer width='100%' height={200}>
							<LineChart data={stats.promoCodesUsage}>
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<CartesianGrid stroke='#f5f5f5' />
								<Line type='monotone' dataKey='usage' stroke='#ff7300' />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Grid>

			{/* Статусы заявок */}
			<Grid item xs={12} md={6}>
				<Card>
					<CardContent>
						<Typography variant='h6'>Статус заявок</Typography>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Typography variant='body1'>В Ожидании</Typography>
								<Typography variant='h5'>
									{stats.orderStatuses.pending}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant='body1'>Подтверждено</Typography>
								<Typography variant='h5'>
									{stats.orderStatuses.confirmed}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant='body1'>Отменено</Typography>
								<Typography variant='h5'>
									{stats.orderStatuses.cancelled}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant='body1'>Доставлено</Typography>
								<Typography variant='h5'>
									{stats.orderStatuses.delivered}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	)
}

export default Dashboard
