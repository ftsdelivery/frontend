import Image from 'next/image'
import styles from './Loader.module.css'

export default function Loader() {
	return (
		<div className={styles.loader}>
			<Image
				src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo/logo_v1.svg`}
				alt='logo'
				width={400}
				height={300}
				priority={true}
			/>
			<div className={styles['loader-inner']}>
				<div className={styles['loader-circle']}></div>
				<div className={styles['loader-circle']}></div>
				<div className={styles['loader-circle']}></div>
				<div className={styles['loader-circle']}></div>
			</div>
		</div>
	)
}
