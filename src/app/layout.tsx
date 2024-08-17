import BootstrapClient from '@/components/BootstrapClient'
import { SITE_NAME } from '@/constants/seo.constants'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '300', '400', '500', '700', '900'],
	display: 'swap',
	variable: '--font-roboto',
	style: 'normal',
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: 'Лучший сервис по доставке груза',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body className={roboto.className}>
				{children}
				<BootstrapClient />
				<Toaster theme='system' position='bottom-right' duration={1500} />
			</body>
		</html>
	)
}
