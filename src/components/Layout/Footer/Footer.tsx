export default function Footer() {
	return (
		<footer className={`bg-light text-center text-lg-start`}>
			<div>
				<div className='container p-4'>
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
							<h5 className='text-uppercase'>Навигация</h5>
							<ul className='list-unstyled mb-0'>
								<li>
									<a href='#' className='text-dark'>
										Новости
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										Как подать заявку?
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										О компании
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										Поддержка
									</a>
								</li>
							</ul>
						</div>

						{/* Правовая информация */}
						<div className='col-lg-4 col-md-12 mb-4 mb-md-0'>
							<h5 className='text-uppercase'>Правовая информация</h5>
							<ul className='list-unstyled mb-0'>
								<li>
									<a href='#' className='text-dark'>
										Политика конфиденциальности
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										Пользовательское соглашение
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										Условия использования
									</a>
								</li>
								<li>
									<a href='#' className='text-dark'>
										Контакты
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Подвал */}
			<div className='text-center p-3'>
				© {new Date().getFullYear()} FTS Delivery. Все права защищены.
			</div>
		</footer>
	)
}
