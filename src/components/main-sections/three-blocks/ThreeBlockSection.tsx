import styles from './ThreeBlocksSection.module.css'

export default function ThreeBlocksSecionComponent() {
	return (
		<section className={`container my-5 ${styles.Container}`}>
			<div className='row text-center mt-4'>
				<div className='col-md-4'>
					<div className='p-4'>
						<div className={`${styles.iconCircle} mb-3`}>
							<i className={`bi bi-truck fs-1 ${styles.iconWhite}`}></i>
						</div>
						<h5 className='fw-bold mt-5'>
							Надежная команда & Надёжная доставка
						</h5>
						<p>
							Мы предлагаем надёжные услуги по доставке грузов. Наши специалисты
							помогут вам с доставкой вашего груза в любую точку Москвы и
							области.
						</p>
					</div>
				</div>
				<div className='col-md-4'>
					<div className='p-4'>
						<div className={`${styles.iconCircle} mb-3`}>
							<i className={`bi bi-clock fs-1 ${styles.iconWhite}`}></i>
						</div>
						<h5 className='fw-bold mt-5'>Ценность доставки</h5>
						<p>
							Мы стремимся удовлетворить любые ваши потребности. Мы никогда не
							берём дополнительную плату за услуги в нерабочее время, выходные и
							праздничные дни, а также за услуги погрузки.
						</p>
					</div>
				</div>
				<div className='col-md-4'>
					<div className='p-4'>
						<div className={`${styles.iconCircle} mb-3`}>
							<i className={`bi bi-geo-alt fs-1 ${styles.iconWhite}`}></i>
						</div>
						<h5 className='fw-bold mt-5'>Наши отличия Ваше преимущество</h5>
						<p>
							Вы оплачиваете только товар, не задумываясь о его весе и месте
							доставки. Кроме того, вам не нужно беспокоиться о том, что ваш
							товар будет утерян или поврежден во время транспортировки.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
