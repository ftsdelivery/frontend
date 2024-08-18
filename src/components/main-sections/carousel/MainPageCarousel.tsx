import styles from './MainPageCarousel.module.css'

export default function MainPageCarousel() {
	return (
		<section className={`container my-5 ${styles.Block}`}>
			<div className={styles.carousel_container}>
				<div
					id='carouselExampleAutoplaying'
					className='carousel slide'
					data-bs-ride='carousel'
				>
					<div className='carousel-inner'>
						<div className='carousel-item active' data-bs-interval='5000'>
							<img
								src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
								className='d-block w-100'
								alt='...'
							/>
						</div>
						<div className='carousel-item' data-bs-interval='5000'>
							<img
								src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
								className='d-block w-100'
								alt='...'
							/>
						</div>
						<div className='carousel-item' data-bs-interval='5000'>
							<img
								src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
								className='d-block w-100'
								alt='...'
							/>
						</div>
					</div>
					<button
						className='carousel-control-prev'
						type='button'
						data-bs-target='#carouselExampleAutoplaying'
						data-bs-slide='prev'
					>
						<span
							className='carousel-control-prev-icon'
							aria-hidden='true'
						></span>
						<span className='visually-hidden'>Previous</span>
					</button>
					<button
						className='carousel-control-next'
						type='button'
						data-bs-target='#carouselExampleAutoplaying'
						data-bs-slide='next'
					>
						<span
							className='carousel-control-next-icon'
							aria-hidden='true'
						></span>
						<span className='visually-hidden'>Next</span>
					</button>
				</div>
			</div>
		</section>
	)
}
