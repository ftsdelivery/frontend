import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js'
import React from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface OrderChartProps {
	data: {
		allTime: number
		thisMonth: number
		thisWeek: number
		today: number
	}
}

const OrderChart: React.FC<OrderChartProps> = ({ data }) => {
	const chartData = {
		labels: ['Все время', 'Этот месяц', 'Эта неделя', 'Сегодня'],
		datasets: [
			{
				label: 'Количество заказов',
				data: [data.allTime, data.thisMonth, data.thisWeek, data.today],
				backgroundColor: [
					'rgba(255, 99, 132, 0.6)',
					'rgba(54, 162, 235, 0.6)',
					'rgba(75, 192, 192, 0.6)',
					'rgba(255, 159, 64, 0.6)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 2,
			},
		],
	}

	const options = {
		responsive: true,
		scales: {
			x: {
				grid: {
					color: 'rgba(0, 0, 0, 0.1)',
				},
				title: {
					display: true,
					text: 'Период',
				},
			},
			y: {
				grid: {
					color: 'rgba(0, 0, 0, 0.1)',
				},
				title: {
					display: true,
					text: 'Количество заказов',
				},
			},
		},
		plugins: {
			legend: {
				position: 'top' as const,
			},
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				titleColor: '#fff',
				bodyColor: '#fff',
			},
		},
	}

	return (
		<div className='col-md-6 mb-4'>
			<div className='card shadow border-0 rounded'>
				<div className='card-body'>
					<h5 className='card-title'>График заявок</h5>
					<Bar data={chartData} options={options} />
				</div>
			</div>
		</div>
	)
}

export default OrderChart
