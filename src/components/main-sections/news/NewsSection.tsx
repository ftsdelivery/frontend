export default function NewsSectionComponent() {
	return (
		<section id='news' className='container py-5'>
			<div className='row'>
				<div className='col-md-6'>
					<h2 className='fw-bold mb-4'>
						<i className='bi bi-newspaper text-primary me-2'></i> Новости
					</h2>
					<p>
						Оставайтесь в курсе последних событий нашей компании. Читайте самые
						свежие новости и будьте в курсе наших последних достижений и
						нововведений.
					</p>
					<a href='#' className='btn btn-primary'>
						Читать больше
					</a>
				</div>
				<div className='col-md-6 mt-3'>
					<img
						src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
						className='img-fluid rounded'
						alt='Новости'
					/>
				</div>
			</div>
		</section>
	)
}
