'use client'

import { getAllNews } from '@/services/news.service'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, Carousel, Col, Row } from 'react-bootstrap'
import styles from './NewsSlider.module.css'

export default function NewsSlider() {
	const [newsItems, setNewsItems] = useState<any[]>([])
	const [loading, setLoading] = useState(true) // Состояние загрузки новостей
	const [cardsPerSlide, setCardsPerSlide] = useState(3)

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const data = await getAllNews()
				setNewsItems(data.data)
			} catch (error) {
				console.error('Ошибка при загрузке новостей', error)
			} finally {
				setLoading(false)
			}
		}

		fetchNews()
	}, [])

	useEffect(() => {
		const updateCardsPerSlide = () => {
			const width = window.innerWidth
			if (width < 576) {
				setCardsPerSlide(1)
			} else if (width < 768) {
				setCardsPerSlide(2)
			} else {
				setCardsPerSlide(3)
			}
		}

		updateCardsPerSlide()
		window.addEventListener('resize', updateCardsPerSlide)
		return () => window.removeEventListener('resize', updateCardsPerSlide)
	}, [])

	const chunkArray = (array: any[], chunkSize: number) => {
		const result = []
		for (let i = 0; i < array.length; i += chunkSize) {
			result.push(array.slice(i, i + chunkSize))
		}
		return result
	}

	const PlaceholderCard = () => (
		<div className={`${styles.newsCard} card h-100`} aria-hidden='true'>
			<div className='placeholder-glow'>
				<img
					src=''
					className={`card-img-top placeholder ${styles.img_placeholder}`}
					alt='...'
				/>
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

	const slides = chunkArray(newsItems, cardsPerSlide)

	return (
		<div className='container py-5'>
			<h1 className='text-center mb-4'>Новости</h1>
			<Carousel
				controls={false}
				indicators={false}
				interval={3000}
				touch={true}
				pause={'hover'}
			>
				{loading
					? [0, 1, 2].map((_, index) => (
							<Carousel.Item key={index}>
								<Row>
									{[0, 1, 2].map((_, i) => (
										<Col key={i} md={12 / cardsPerSlide} className='mb-3'>
											<div className='col-md-12 mb-4 mx-auto'>
												<PlaceholderCard />
											</div>
										</Col>
									))}
								</Row>
							</Carousel.Item>
					  ))
					: slides.map((newsChunk, index) => (
							<Carousel.Item key={index}>
								<Row>
									{newsChunk.map((newsItem, i) => (
										<Col key={i} md={12 / cardsPerSlide} className='mb-3'>
											<Card className={styles.newsCard}>
												<Card.Img
													variant='top'
													src={newsItem.image}
													alt={newsItem.title}
													className={styles.cardImage}
												/>
												<Card.Body>
													<Card.Title>{newsItem.title}</Card.Title>
													<p className={`mt-2 ${styles.newsExcerpt}`}>
														{new Date(
															newsItem.created_at || ''
														).toLocaleDateString('ru-RU', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}
													</p>
													<Card.Text className={styles.cardText}>
														{newsItem.content}
													</Card.Text>
													<Link
														className={styles.ReadMoreButton}
														href={`/news/${newsItem.id}`}
														passHref
													>
														Читать полностью
													</Link>
												</Card.Body>
											</Card>
										</Col>
									))}
								</Row>
							</Carousel.Item>
					  ))}
			</Carousel>
		</div>
	)
}
