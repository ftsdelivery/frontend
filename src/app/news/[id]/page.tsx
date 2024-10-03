'use client'

import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { getNewsById } from '@/services/news.service'
import { News } from '@/types/news.types'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function NewsDetailsPage() {
	const router = useRouter()
	const { id } = useParams() // Динамическое значение id из URL
	const [newsItem, setNewsItem] = useState<News>()

	useEffect(() => {
		if (id) {
			const fetchNews = async () => {
				try {
					const data = await getNewsById(Number(id)) // Запрос новости по id
					setNewsItem(data.data[0])
				} catch (error) {
					console.error('Error fetching news item:', error)
				}
			}
			fetchNews()
		}
	}, [id])

	if (!newsItem) {
		return <div className='text-center mt-5'>Загрузка новости...</div>
	}

	return (
		<>
			<Navbar />
			<div className={styles.BackGround}>
				<div className='container mt-5 pt-5'>
					<h1>{newsItem.title}</h1>
					<img
						src={newsItem.image}
						alt={newsItem.title}
						className='img-fluid mb-3'
					/>
					<p>{newsItem.content}</p>
				</div>

				<Footer />
			</div>
		</>
	)
}
