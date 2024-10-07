'use client'

import { useState } from 'react'
import styles from './ApplySection.module.css'

export default function ApplySectionComponent() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null)

	const toggleCollapse = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index)
	}

	const faqs = [
		{
			question: 'Как подготовить груз к отправке на ваш склад?',
			answer: (
				<>
					<strong>Мы рады принять ваш груз к отправке!</strong> Для удобства
					обработки и обеспечения безопасности, просим подготовить груз в
					коробках или на паллетах. Также, не забудьте приложить маркировочный
					лист к каждой партии груза. Это обязательное условие для успешного
					приема и дальнейшей отправки вашего груза.
				</>
			),
		},
		{
			question: 'Как правильно упаковать груз для отправки?',
			answer: (
				<>
					<strong>
						Перед отправкой груза очень важно правильно его упаковать.
					</strong>{' '}
					Убедитесь, что ваша упаковка полностью закрыта, и к грузу нет
					свободного доступа. Все выступающие элементы и края должны быть
					надежно упакованы, а сама упаковка должна обеспечивать достаточную
					защиту как самому грузу, так и соседним отправлениям от возможных
					повреждений.
				</>
			),
		},
		{
			question: 'Нужно ли платить за ожидание на складах маркетплейсов?',
			answer: (
				<>
					<strong>
						Нет, оплата за ожидание на складах маркетплейсов не взимается.
					</strong>{' '}
					Мы стремимся обеспечить максимально комфортные и прозрачные условия
					для всех наших клиентов, исключая дополнительные расходы там, где это
					возможно.
				</>
			),
		},
		{
			question: 'Каким образом можно произвести оплату?',
			answer: (
				<>
					<strong>
						Оплата за наши услуги может быть выполнена одним из двух удобных
						способов:
					</strong>{' '}
					через функционал нашего приложения или по выставленному счету.
				</>
			),
		},
		{
			question: 'Каковы сроки доставки груза?',
			answer: (
				<>
					<strong>
						Сроки доставки зависят от направления и загруженности маршрутов.
					</strong>{' '}
					Обычно доставка занимает от 3 до 7 рабочих дней. В случае
					возникновения непредвиденных задержек, мы своевременно уведомляем
					наших клиентов и стараемся минимизировать любые неудобства.
				</>
			),
		},
		{
			question: 'Как оформить возврат груза?',
			answer: (
				<>
					<strong>
						Для оформления возврата груза, свяжитесь с нашей службой поддержки.
					</strong>{' '}
					Мы оперативно рассмотрим ваш запрос и предоставим все необходимые
					инструкции для возврата груза. Обратите внимание, что процедура
					возврата может занять несколько дней, в зависимости от сложности
					вопроса.
				</>
			),
		},
	]

	return (
		<section id='faq'>
			<div className={`container ${styles.faqSection} pt-1 pb-5`}>
				<h2 className={`my-4 ${styles.faqTitle} d-flex justify-content-center`}>
					FAQ
				</h2>
				<div className={styles.accordion} id='accordionPanelsStayOpenExample'>
					{faqs.map((faq, index) => (
						<div className={styles.accordionItem} key={index}>
							<h2 className={styles.accordionHeader}>
								<button
									className={`${styles.accordionButton} ${
										activeIndex === index ? styles.expanded : styles.collapsed
									}`}
									type='button'
									onClick={() => toggleCollapse(index)}
								>
									{faq.question}
								</button>
							</h2>
							<div
								className={`${styles.accordionCollapse} ${
									activeIndex === index ? styles.show : ''
								}`}
							>
								<div className={styles.accordionBody}>{faq.answer}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
