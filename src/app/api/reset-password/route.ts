import { getUserByEmail, updateUser } from '@/services/user.service' // Предполагается, что у вас есть такая функция
import nodemailer from 'nodemailer'

// Генерация токена для сброса пароля (пример функции)
const generateResetToken = () => {
	// Генерация токена (можно использовать uuid, jwt или другие методы)
	return Math.random().toString(36).substr(2) // Простой пример
}

const createEmailTemplate = (userName: string, resetLink: string) => {
	return `
	<!DOCTYPE html>
	<html lang="ru">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 0;
				padding: 0;
				background-color: #f4f4f4;
			}
			.container {
				width: 100%;
				max-width: 600px;
				margin: 20px auto;
				background-color: #ffffff;
				padding: 20px;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			.header {
				text-align: center;
				padding-bottom: 20px;
			}
			.header img {
				width: 350px;
				height: 300px;
			}
			.content {
				line-height: 1.5;
			}
			.footer {
				text-align: center;
				margin-top: 20px;
				font-size: 0.9em;
				color: #888888;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<img src="https://i.imgur.com/tU6Ecqb.png" alt="Логотип" />
				<h1>Восстановление пароля</h1>
			</div>
			<div class="content">
				<p>Здравствуйте, <strong>${userName}</strong>!</p>
				<p>Вы запросили сброс пароля для вашей учетной записи. Для восстановления пароля нажмите на кнопку ниже:</p>
				<p>
					<a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block;">Сбросить пароль</a>
				</p>
				<p>Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.</p>
				<p>С наилучшими пожеланиями,<br />Команда поддержки</p>
			</div>
			<div class="footer">
				<p>
					<a href="${process.env.NEXT_PUBLIC_BASE_URL}">Посетите наш сайт</a> | 
					<a href="${process.env.NEXT_PUBLIC_BASE_URL}/support">Свяжитесь с поддержкой</a>
				</p>
				<p>&copy; 2024 FTS Delivery. Все права защищены.</p>
			</div>
		</div>
	</body>
	</html>
	`
}

export async function POST(request: Request) {
	const { email } = await request.json() // Получаем тело запроса

	const user = await getUserByEmail(email)
	if (!user) {
		return new Response(JSON.stringify({ message: 'Пользователь не найден' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	// Генерируем токен для сброса пароля и сохраняем его (например, в БД)
	const resetToken = generateResetToken() // Ваша логика генерации токена
	const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signin/reset-password?token=${resetToken}`

	// Настройка транспортера Nodemailer
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	// Используем HTML-шаблон для письма
	const emailTemplate = createEmailTemplate(
		user.name || 'уважаемый клиент',
		resetLink
	)

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'Восстановление пароля',
		html: emailTemplate, // Используем HTML-шаблон
	}

	try {
		await transporter.sendMail(mailOptions)
		// Сохраняем токен в базе данных (привязанный к пользователю)
		await updateUser(user.id, { reset_token: resetToken })
		return new Response(JSON.stringify({ message: 'Письмо отправлено' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Ошибка отправки письма:', error)
		return new Response(JSON.stringify({ message: 'Ошибка отправки письма' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
