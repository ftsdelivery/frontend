// next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string // Добавляем id в сессию
			email: string
			name: string
			image?: string
		}
	}

	interface JWT {
		id: string // Добавляем id в токен
		email: string
		name: string
	}
}
