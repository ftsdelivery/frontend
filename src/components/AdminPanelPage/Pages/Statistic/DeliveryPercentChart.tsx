import { getAllOrders } from '@/services/order.service'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const DeliveryPercentChart: React.FC = () => {
	const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>(
		{}
	)
	const [totalOrders, setTotalOrders] = useState<number>(0)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getAllOrders()
				const orders = response.data || []
				const counts: { [key: string]: number } = {
					PENDING: 0,
					CONFIRMED: 0,
					DELIVERED: 0,
					CANCELED: 0,
					OVERDUE: 0,
				}

				orders.forEach((order: any) => {
					if (counts.hasOwnProperty(order.status)) {
						counts[order.status] += 1
					}
				})

				setStatusCounts(counts)
				setTotalOrders(orders.length)
			} catch (error) {
				console.error('Ошибка получения данных о заказах:', error)
			}
		}

		fetchData()
	}, [])

	const pendingPercent = ((statusCounts.PENDING || 0) / totalOrders) * 100
	const confirmedPercent = ((statusCounts.CONFIRMED || 0) / totalOrders) * 100
	const deliveredPercent = ((statusCounts.DELIVERED || 0) / totalOrders) * 100
	const canceledPercent = ((statusCounts.CANCELED || 0) / totalOrders) * 100
	const overduePercent = ((statusCounts.OVERDUE || 0) / totalOrders) * 100

	const data = {
		labels: [
			'На рассмотрении',
			'Подтвержденные',
			'Выполненные',
			'Отмененные',
			'Просроченные',
		],
		datasets: [
			{
				data: [
					pendingPercent,
					confirmedPercent,
					deliveredPercent,
					canceledPercent,
					overduePercent,
				],
				backgroundColor: [
					'rgba(255, 159, 64, 0.6)', // Оранжевый для "На рассмотрении"
					'rgba(54, 162, 235, 0.6)', // Синий для "Подтвержденные"
					'rgba(77, 192, 75, 0.6)', // Зеленый для "Выполненные"
					'rgba(255, 99, 132, 0.6)', // Красный для "Отмененные"
					'rgba(255, 0, 0, 1)', // Красный для "Просроченные"
				],
				borderColor: [
					'rgba(255, 159, 64, 1)', // Оранжевый для "На рассмотрении"
					'rgba(54, 162, 235, 1)', // Синий для "Подтвержденные"
					'rgba(75, 192, 192, 1)', // Зеленый для "Выполненные"
					'rgba(255, 99, 132, 1)', // Красный для "Отмененные"
					'rgba(255, 0, 0, 1)', // Красный для "Просроченные"
				],
				borderWidth: 2,
			},
		],
	}

	return (
		<div className='col-md-6 mb-4'>
			<div className='card shadow border-0 rounded'>
				<div className='card-body'>
					<h5 className='card-title'>Процент статусов заказов</h5>
					<Pie data={data} />
				</div>
			</div>
		</div>
	)
}

export default DeliveryPercentChart
