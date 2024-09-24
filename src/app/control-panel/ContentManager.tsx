import Logs from '@/components/AdminPanelPage/Pages/Logs/Logs'
import Orders from '@/components/AdminPanelPage/Pages/Orders/Orders'
import Promo from '@/components/AdminPanelPage/Pages/Promo/PromoCodes'
import Settings from '@/components/AdminPanelPage/Pages/Settings/Settings'
import Statistic from '@/components/AdminPanelPage/Pages/Statistic/Statistic'
import Support from '@/components/AdminPanelPage/Pages/Support'
import Users from '@/components/AdminPanelPage/Pages/Users/Users'

interface ContentManagerProps {
	content: string
}

const ContentManager: React.FC<ContentManagerProps> = ({ content }) => {
	switch (content) {
		case 'statistic':
			return <Statistic />
		case 'orders':
			return <Orders />
		case 'support':
			return <Support />
		case 'promo':
			return <Promo />
		case 'users':
			return <Users />
		case 'settings':
			return <Settings />
		case 'logs':
			return <Logs />
		default:
			return <Statistic />
	}
}

export default ContentManager
