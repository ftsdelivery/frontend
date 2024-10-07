// src/app/api/support/sendEmail.ts
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
	const { userEmail, adminReply, userName } = await request.json()

	// Настройка транспондера для отправки писем
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST, // Например, smtp.gmail.com
		port: 587, // Обычно 587 для TLS
		secure: false, // true для 465, false для других портов
		auth: {
			user: process.env.EMAIL_USER, // ваш email
			pass: process.env.EMAIL_PASS, // ваш пароль
		},
	})

	// HTML-шаблон
	const emailTemplate = `
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
				heigth: 300px /* Задайте желаемую ширину логотипа */
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
			a {
				color: #007bff;
				text-decoration: none;
			}
			a:hover {
				text-decoration: underline;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<img src="https://i.imgur.com/tU6Ecqb.png" alt="Логотип" />
				<h1>Ответ на ваш запрос в поддержку</h1>
			</div>
			<div class="content">
				<p>Здравствуйте, <strong>${userName}</strong>!</p>
				<p>
					Ваш вопрос был успешно рассмотрен. Ниже приведен ответ от нашего
					администратора:
				</p>
				<blockquote>
					<p><strong>${adminReply}</strong></p>
				</blockquote>
				<p>
					Если у вас есть дополнительные вопросы, не стесняйтесь обращаться к
					нам.
				</p>
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

	// Настройка содержимого письма
	const mailOptions = {
		from: process.env.EMAIL_USER, // ваш email
		to: userEmail, // email пользователя
		subject: 'Ответ на ваш вопрос',
		html: emailTemplate, // используем HTML-шаблон
	}

	try {
		await transporter.sendMail(mailOptions)
		return new Response(JSON.stringify({ success: true }), { status: 200 })
	} catch (error) {
		console.error('Error sending email:', error)
		return new Response(JSON.stringify({ error: 'Failed to send email' }), {
			status: 500,
		})
	}
}
