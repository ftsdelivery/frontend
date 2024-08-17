import { getUserIdByEmail, getUserOrders } from '@/services/user.service'
import { getServerSession } from 'next-auth'
import Profile from './Profile'

export default async function ProfilePage() {
	const session = await getServerSession()
	const userId = await getUserIdByEmail(session?.user?.email ?? '')
	const orders_response = await getUserOrders(userId)
	const orders_data = orders_response

	return <Profile orders={orders_data} />
}
