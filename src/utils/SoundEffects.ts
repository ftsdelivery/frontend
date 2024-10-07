// utils/soundUtils.ts

const successSound = new Audio('/sounds/success.mp3')
const errorSound = new Audio('/sounds/error.mp3')

/**
 * Воспроизводит звук успеха
 */
export const playSuccessSound = () => {
	successSound.play().catch(error => {
		console.error('Ошибка воспроизведения звука успеха:', error)
	})
}

/**
 * Воспроизводит звук ошибки
 */
export const playErrorSound = () => {
	errorSound.play().catch(error => {
		console.error('Ошибка воспроизведения звука ошибки:', error)
	})
}
