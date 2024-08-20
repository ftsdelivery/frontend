import Image from 'next/image'

interface LogoComponentProps {
	width: number
	height: number
}

const LogoComponent: React.FC<LogoComponentProps> = ({ width, height }) => (
	<a className='navbar-brand mt-3' href='/'>
		<Image
			src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo/logo_v1.svg`}
			alt='Logo'
			width={width}
			height={height}
		/>
	</a>
)

export default LogoComponent
