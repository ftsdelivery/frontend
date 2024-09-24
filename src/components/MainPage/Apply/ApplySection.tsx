'use client'

import { useState } from 'react'
import styles from './ApplySection.module.css'

export default function ApplySectionComponent() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null)

	const toggleCollapse = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index)
	}

	return (
		<section id='faq'>
			<div className={`container ${styles.faqSection} pt-1 pb-5`}>
				<h2 className={`my-4 ${styles.faqTitle} d-flex justify-content-center`}>
					FAQ
				</h2>
				<div className={styles.accordion} id='accordionPanelsStayOpenExample'>
					<div className={`${styles.accordionItem}`}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 0 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(0)}
							>
								Как подготовить груз к отправке на ваш склад?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseOne'
							className={`${styles.accordionCollapse} ${
								activeIndex === 0 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>Мы рады принять ваш груз к отправке!</strong> Для
								удобства обработки и обеспечения безопасности, просим
								подготовить груз в коробках или на паллетах. Также, не забудьте
								приложить маркировочный лист к каждой партии груза. Это
								обязательное условие для успешного приема и дальнейшей отправки
								вашего груза.
							</div>
						</div>
					</div>

					<div className={styles.accordionItem}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 1 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(1)}
							>
								Как правильно упаковать груз для отправки?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseTwo'
							className={`${styles.accordionCollapse} ${
								activeIndex === 1 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>
									Перед отправкой груза очень важно правильно его упаковать.
								</strong>{' '}
								Убедитесь, что ваша упаковка полностью закрыта, и к грузу нет
								свободного доступа. Все выступающие элементы и края должны быть
								надежно упакованы, а сама упаковка должна обеспечивать
								достаточную защиту как самому грузу, так и соседним отправлениям
								от возможных повреждений.
							</div>
						</div>
					</div>

					<div className={styles.accordionItem}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 2 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(2)}
							>
								Нужно ли платить за ожидание на складах маркетплейсов?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseThree'
							className={`${styles.accordionCollapse} ${
								activeIndex === 2 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>
									Нет, оплата за ожидание на складах маркетплейсов не взимается.
								</strong>{' '}
								Мы стремимся обеспечить максимально комфортные и прозрачные
								условия для всех наших клиентов, исключая дополнительные расходы
								там, где это возможно.
							</div>
						</div>
					</div>

					<div className={styles.accordionItem}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 3 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(3)}
							>
								Каким образом можно произвести оплату?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseFour'
							className={`${styles.accordionCollapse} ${
								activeIndex === 3 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>
									Оплата за наши услуги может быть выполнена одним из двух
									удобных способов:
								</strong>{' '}
								через функционал нашего приложения или по выставленному счету.
							</div>
						</div>
					</div>

					<div className={styles.accordionItem}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 4 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(4)}
							>
								Каковы сроки доставки груза?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseFive'
							className={`${styles.accordionCollapse} ${
								activeIndex === 4 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>
									Сроки доставки зависят от направления и загруженности
									маршрутов.
								</strong>{' '}
								Обычно доставка занимает от 3 до 7 рабочих дней. В случае
								возникновения непредвиденных задержек, мы своевременно
								уведомляем наших клиентов и стараемся минимизировать любые
								неудобства.
							</div>
						</div>
					</div>

					<div className={styles.accordionItem}>
						<h2 className={styles.accordionHeader}>
							<button
								className={`${styles.accordionButton} ${
									activeIndex === 5 ? styles.expanded : styles.collapsed
								}`}
								type='button'
								onClick={() => toggleCollapse(5)}
							>
								Как оформить возврат груза?
							</button>
						</h2>
						<div
							id='panelsStayOpen-collapseSix'
							className={`${styles.accordionCollapse} ${
								activeIndex === 5 ? styles.show : ''
							}`}
						>
							<div className={styles.accordionBody}>
								<strong>
									Для оформления возврата груза, свяжитесь с нашей службой
									поддержки.
								</strong>{' '}
								Мы оперативно рассмотрим ваш запрос и предоставим все
								необходимые инструкции для возврата груза. Обратите внимание,
								что процедура возврата может занять несколько дней, в
								зависимости от сложности вопроса.
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
