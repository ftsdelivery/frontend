'use client'

import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { getAllNews } from '@/services/news.service'
import type { News } from '@/types/news.types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
import styles from './News.module.css'

const useNews = () => {
	const [news, setNews] = useState<News[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await getAllNews()
				setNews(response.data)
			} catch (error) {
				console.error('Ошибка загрузки новостей:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchNews()
	}, [])

	return { news, loading }
}

// Функция для проверки, создана ли новость в течение последней недели
const isNew = (createdAt: string) => {
	const now = new Date()
	const createdDate = new Date(createdAt)
	const diffTime = Math.abs(now.getTime() - createdDate.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return diffDays <= 7
}

const PlaceholderCard = () => (
	<div className={`${styles.newsCard} card h-100`} aria-hidden='true'>
		<div className='placeholder-glow'>
			<img src='' className='card-img-top placeholder' alt='...' />
			<div className='card-body'>
				<h5 className='card-title placeholder-glow'>
					<span className='placeholder col-8'></span>
				</h5>
				<p className='card-text placeholder-glow'>
					<span className='placeholder col-7'></span>
					<span className='placeholder col-6'></span>
					<span className='placeholder col-4'></span>
					<span className='placeholder col-8'></span>
				</p>
				<a
					className='btn btn-primary disabled placeholder col-6'
					aria-disabled='true'
				></a>
			</div>
		</div>
	</div>
)

export default function NewsPage() {
	const { news, loading } = useNews()

	const renderNews = () => {
		if (loading) {
			return (
				<>
					<div className='col-md-8 mb-4 mx-auto'>
						<PlaceholderCard />
					</div>
					<div className='col-md-4 mb-4'>
						<PlaceholderCard />
					</div>
					<div className='col-md-4 mb-4'>
						<PlaceholderCard />
					</div>
					<div className='col-md-4 mb-4'>
						<PlaceholderCard />
					</div>
				</>
			)
		}

		if (news.length === 0) {
			return <div className='text-center mt-5'>Новостей нет</div>
		}

		const latestNews = news[news.length - 1]
		const otherNews = news.slice(0, -1)

		return (
			<>
				<div className='col-md-8 mb-4 mx-auto'>
					<div className={`${styles.latestNews} card`}>
						<img
							src={latestNews.image}
							alt={latestNews.title}
							className='card-img-top'
						/>
						{isNew(latestNews.created_at || '') && (
							<Badge bg='danger' className={`ms-2 ${styles.Badge}`}>
								Новое
							</Badge>
						)}
						<div className='card-body text-center'>
							<h5 className={styles.newsTitle}>{latestNews.title}</h5>
							<p className={`mt-2 ${styles.newsExcerpt}`}>
								{new Date(latestNews.created_at || '').toLocaleDateString(
									'ru-RU',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									}
								)}
							</p>
							<p className={styles.newsExcerpt}>
								{(latestNews.content?.length ?? 0) > 150
									? (latestNews.content ?? '').substring(0, 150) + '...'
									: latestNews.content}
							</p>
							<Link
								href={`/news/${latestNews.id}`}
								className={`btn ${styles.readMoreBtn}`}
							>
								Читать полностью
							</Link>
						</div>
					</div>
				</div>

				<div className='row'>
					{otherNews.map((item, index) => (
						<div className='col-md-4 mb-4' key={index}>
							<div className={`${styles.newsCard} card h-100`}>
								<img
									src={item.image}
									alt={item.title}
									className='card-img-top'
								/>
								{isNew(item.created_at || '') && (
									<Badge bg='danger' className={`ms-2 ${styles.Badge}`}>
										Новое
									</Badge>
								)}
								<div className='card-body'>
									<h5 className={styles.newsTitle}>{item.title}</h5>
									<p className={`mt-2 ${styles.newsExcerpt}`}>
										{new Date(item.created_at || '').toLocaleDateString(
											'ru-RU',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											}
										)}
									</p>
									<p className={styles.newsExcerpt}>
										{(item.content?.length ?? 0) > 100
											? (item.content ?? '').substring(0, 100) + '...'
											: item.content}
									</p>
									<Link
										href={`/news/${item.id}`}
										className={`btn ${styles.readMoreBtn}`}
									>
										Читать полностью
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</>
		)
	}

	return (
		<div>
			<Navbar />

			<div className={styles.BackGround}>
				<div className={`container mt-5 ${styles.newsContainer}`}>
					<section className='row mt-5'>{renderNews()}</section>
				</div>
			</div>

			<Footer />
		</div>
	)
}
