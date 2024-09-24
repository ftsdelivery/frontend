import { getUsers } from '@/services/user.service'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

interface AuthUser {
	id: string
	email: string
	name: string
}
export let TEST = {}

export const authConfig: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			credentials: {
				email: { label: 'Email', type: 'email', required: true },
				password: { label: 'Password', type: 'password', required: true },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null

				try {
					const users = await getUsers()
					const currentUser = users.data.find(
						(user: AuthUser) => user.email === credentials.email
					)

					if (currentUser && currentUser.password === credentials.password) {
						return {
							id: currentUser.id,
							email: currentUser.email,
							name: currentUser.name,
						}
					}

					return null
				} catch (error) {
					console.error('Error fetching users:', error)
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id // Сохраняем id пользователя
			}
			return token
		},
		async session({ session, token }) {
			// Явно добавляем id в объект session.user
			if (token && token.id) {
				session.user = {
					...session.user, // Сохраняем стандартные поля
					id: token.id as string, // Добавляем id
				}
			}
			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
}
