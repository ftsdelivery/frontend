import React from 'react'

interface UserStatsCardProps {
	title: string
	value: number
	bgColor: string
	icon: string
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
	title,
	value,
	bgColor,
	icon,
}) => {
	return (
		<div className='col-md-6 col-lg-3 mb-4'>
			<div
				className={`card bg-${bgColor} text-${
					bgColor === 'warning' ? 'dark' : 'white'
				} text-center shadow rounded p-3`}
			>
				<div className='mb-2 fs-3'>
					<i className={icon}></i>
				</div>
				<h5 className='card-title mb-2'>{title}</h5>
				<p className='card-text fs-4 fw-bold'>{value}</p>
			</div>
		</div>
	)
}

export default UserStatsCard
