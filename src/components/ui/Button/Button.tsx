import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
	variant?: 'primary' | 'success' | 'secondary' | 'warning' | 'danger'
	outline?: boolean
	size?: 'sm' | 'md' | 'lg'
	fw?: 'normal' | 'bold'
	children: React.ReactNode
	onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	outline,
	size = 'md',
	fw = 'normal',
	children,
	onClick,
}) => {
	const classNames = [
		outline ? styles[`btn_${variant}_outline`] : styles[`btn_${variant}`],
		styles[`btn_${size}`],
		styles[`fw_${fw}`],
	].join(' ')

	return (
		<button className={classNames} onClick={onClick}>
			{children}
		</button>
	)
}

export default Button
