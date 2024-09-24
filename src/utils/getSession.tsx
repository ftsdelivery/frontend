import { getServerSession } from 'next-auth'

export default async function getSessionUtil() {
	const session = getServerSession()
	console.log('session from getSession:', session)
	return session
}
