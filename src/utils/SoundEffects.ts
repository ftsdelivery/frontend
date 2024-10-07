// utils/soundUtils.ts

let successSound: HTMLAudioElement | null = null
let errorSound: HTMLAudioElement | null = null

// Проверяем, что мы находимся в браузере
if (typeof window !== 'undefined') {
	successSound = new Audio('/sounds/success.mp3')
	errorSound = new Audio('/sounds/error.mp3')
}

/**
 * Воспроизводит звук успеха
 */
export const playSuccessSound = () => {
	if (successSound) {
		successSound.play().catch(error => {
			console.error('Ошибка воспроизведения звука успеха:', error)
		})
	}
}

/**
 * Воспроизводит звук ошибки
 */
export const playErrorSound = () => {
	if (errorSound) {
		errorSound.play().catch(error => {
			console.error('Ошибка воспроизведения звука ошибки:', error)
		})
	}
}
