import styles from './Footer.module.css'

export default function Footer() {
	return (
		<footer className={`bg-light text-center text-lg-start`}>
			<div className={`${styles.Footer}`}>
				<div className='container p-4 pt-5'>
					<div className='row'>
						{/* О нас */}
						<div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
							<h5 className='text-uppercase'>О нас</h5>
							<p>
								Мы предоставляем лучшие услуги в своей сфере и стремимся к тому,
								чтобы наши клиенты были довольны на всех этапах сотрудничества.
							</p>
						</div>

						{/* Навигация */}
						<div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
							<h5 className={`text-uppercase ${styles.Title}`}>Навигация</h5>
							<ul className={`list-unstyled mb-0 ${styles.Links}`}>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Новости
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										FAQ
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Отзывы
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										О нас
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Поддержка
									</a>
								</li>
							</ul>
						</div>

						{/* Правовая информация */}
						<div className='col-lg-4 col-md-12 mb-4 mb-md-0'>
							<h5 className={`text-uppercase ${styles.Title}`}>
								Правовая информация
							</h5>
							<ul className={`list-unstyled mb-0 ${styles.Links}`}>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Политика конфиденциальности
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Пользовательское соглашение
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Условия использования
									</a>
								</li>
								<li>
									<a href='#' className={`text-dark${styles.Link}`}>
										Контакты
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Подвал */}
			<div className={`text-center p-3 ${styles.Footer}`}>
				© {new Date().getFullYear()} FTS Delivery. Все права защищены.
			</div>
		</footer>
	)
}
