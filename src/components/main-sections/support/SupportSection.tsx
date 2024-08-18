import styles from './SupportSection.module.css'

export default function SupportSectionComponent() {
	return (
		<section id='support' className={`container py-5`}>
			<div className='row'>
				<div className='col-md-6 order-md-2'>
					<h2 className='fw-bold mb-4'>
						<i className='bi bi-headset text-primary me-2'></i> Поддержка
					</h2>
					<p>
						Наша служба поддержки всегда готова помочь вам. Свяжитесь с нами по
						любым вопросам и получите оперативную и профессиональную помощь.
					</p>
					<a href='#' className={`btn btn-primary ${styles.ButtonMore}`}>
						Связаться с поддержкой
					</a>
				</div>
				<div className='col-md-6 order-md-1 mt-3'>
					<img
						src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
						className='img-fluid rounded'
						alt='Поддержка'
					/>
				</div>
			</div>
		</section>
	)
}
