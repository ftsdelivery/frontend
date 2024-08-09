export default function AboutSectionComponent() {
	return (
		<section id='about' className='container py-5'>
			<div className='row'>
				<div className='col-md-6'>
					<h2 className='fw-bold mb-4'>
						<i className='bi bi-info-circle text-warning me-2'></i> О Компании
					</h2>
					<p>
						Узнайте больше о нашей компании, её истории, миссии и ценностях. Мы
						стремимся к достижению высоких стандартов и постоянно развиваемся,
						чтобы предоставлять лучшие услуги.
					</p>
					<a href='#' className='btn btn-warning text-white'>
						Подробнее о нас
					</a>
				</div>
				<div className='col-md-6 mt-3'>
					<img
						src='http://localhost:3000/carousel/test_image.jpg'
						className='img-fluid rounded'
						alt='О Компании'
					/>
				</div>
			</div>
		</section>
	)
}
