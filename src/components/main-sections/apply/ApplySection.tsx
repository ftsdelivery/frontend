export default function ApplySectionComponent() {
	return (
		<section id='apply' className='container py-5 bg-light'>
			<div className='row'>
				<div className='col-md-6 order-md-2'>
					<h2 className='fw-bold mb-4'>
						<i className='bi bi-file-earmark-text text-success me-2'></i> Как
						подать заявку?
					</h2>
					<p>
						Узнайте, как легко и быстро подать заявку на участие в наших
						программах. Мы предоставляем пошаговую инструкцию, которая поможет
						вам сделать это без проблем.
					</p>
					<a href='#' className='btn btn-success'>
						Узнать больше
					</a>
				</div>
				<div className='col-md-6 order-md-1 mt-3'>
					<img
						src='https://fts-delivery.vercel.app/carousel/test_image.jpg'
						className='img-fluid rounded'
						alt='Как подать заявку?'
					/>
				</div>
			</div>
		</section>
	)
}
