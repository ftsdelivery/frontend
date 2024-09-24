'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface LogoComponentProps {
	width: number
	height: number
}

const LogoComponent: React.FC<LogoComponentProps> = ({ width, height }) => {
	const router = useRouter()

	return (
		<a
			className='navbar-brand mt-3'
			style={{ cursor: 'pointer' }}
			onClick={() => router.push('/')}
		>
			<Image
				src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/logo_v1.svg`}
				alt='Logo'
				width={width}
				height={height}
				priority
			/>
		</a>
	)
}

export default LogoComponent
