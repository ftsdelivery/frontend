// components/TopBar.js
import styles from './Topbar.module.css'

const Topbar = ({ adminName }: any) => {
	return (
		<div
			className={`p-3 d-flex justify-content-between align-items-center ${styles.topbar}`}
		>
			<h4>Админ Панель</h4>
			<div className='d-flex align-items-center'>
				<i className='bi bi-person-circle me-2'></i>
				<span>{adminName}</span>
			</div>
		</div>
	)
}

export default Topbar
