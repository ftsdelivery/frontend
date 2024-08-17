import { getUsers } from '@/services/user.service'
import type { AuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoggleProvider from 'next-auth/providers/google'

export const authConfig: AuthOptions = {
	providers: [
		GoggleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		Credentials({
			credentials: {
				email: { label: 'email', type: 'email', required: true },
				password: { label: 'password', type: 'password', required: true },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null

				try {
					// Использование вашего сервиса для получения пользователей
					const users = await getUsers()

					// Поиск пользователя с соответствующим email
					const currentUser = users.data.find(
						(user: User) => user.email === credentials.email
					)

					if (currentUser && currentUser.password === credentials.password) {
						const { password, ...userWithoutPass } = currentUser

						return userWithoutPass as User
					}

					return null
				} catch (error) {
					console.error('Error fetching users:', error)
					return null
				}
			},
		}),
	],
	pages: {
		signIn: 'signin',
	},
}
