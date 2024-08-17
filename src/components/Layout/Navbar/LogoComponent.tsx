import Logo from '@/../../public/logo/logo_v1.svg'
import Image from 'next/image'

interface LogoComponentProps {
	width: number
	height: number
}

const LogoComponent: React.FC<LogoComponentProps> = ({ width, height }) => (
	<a className='navbar-brand' href='/'>
		<Image src={Logo} alt='Logo' width={width} height={height} />
	</a>
)

export default LogoComponent
