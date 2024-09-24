import styles from './Navbar.module.css'

const MobileToggle = () => (
	<button
		className={`navbar-toggler ${styles.MobileToggle} me-4`}
		type='button'
		data-bs-toggle='collapse'
		data-bs-target='#navbarNav'
		aria-controls='navbarNav'
		aria-expanded='false'
		aria-label='Toggle navigation'
	>
		<i className={`bi bi-list ${styles.IconMOBILE}`}></i>
	</button>
)

export default MobileToggle
