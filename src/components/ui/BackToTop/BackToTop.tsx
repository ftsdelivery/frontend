'use client'

import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import styles from './BackTopTop.module.css'

export default function BackToTopButton() {
	const [isVisible, setIsVisible] = useState(false)

	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true)
		} else {
			setIsVisible(false)
		}
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility)
		return () => window.removeEventListener('scroll', toggleVisibility)
	}, [])

	return (
		<Button
			onClick={scrollToTop}
			className={`${styles.backToTopButton} ${
				isVisible ? styles.show : styles.hide
			}`}
			aria-label='Scroll to top'
		>
			<i className='bi bi-arrow-up'></i>
			<span className={styles.buttonText}>Наверх</span> {/* Текст "Наверх" */}
		</Button>
	)
}
