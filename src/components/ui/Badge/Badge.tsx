import styles from './Badge.module.css'

interface BadgeProps {
	variant?: 'primary' | 'success' | 'secondary' | 'warning' | 'danger'
	outline?: boolean
	size?: 'sm' | 'md' | 'lg'
	fw?: 'normal' | 'bold'
	children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({
	variant = 'primary',
	outline,
	size = 'sm',
	fw = 'normal',
	children,
}) => {
	const classNames = [
		outline
			? `${styles.badge} ${styles[`bg_${variant}_outline`]}`
			: `${styles.badge} ${styles[`bg_${variant}`]}`,
		`${styles[`size_${size}`]}`,
		`${styles[`fw_${fw}`]}`,
	].join(' ')
	return <span className={classNames}>{children}</span>
}

export default Badge
