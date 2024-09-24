import React from 'react'
import { Pagination } from 'react-bootstrap'

interface PaginateProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

const Paginate: React.FC<PaginateProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const pagesToShow = 3 // Количество страниц для отображения в пагинации

	const getPages = () => {
		const pages = []
		let startPage: number
		let endPage: number

		if (totalPages <= pagesToShow) {
			startPage = 1
			endPage = totalPages
		} else {
			if (currentPage <= Math.ceil(pagesToShow / 2)) {
				startPage = 1
				endPage = pagesToShow
			} else if (currentPage + Math.floor(pagesToShow / 2) >= totalPages) {
				startPage = totalPages - pagesToShow + 1
				endPage = totalPages
			} else {
				startPage = currentPage - Math.floor(pagesToShow / 2)
				endPage = currentPage + Math.floor(pagesToShow / 2)
			}
		}

		if (startPage > 1) {
			pages.push(1)
			if (startPage > 2) pages.push('...')
		}
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) pages.push('...')
			pages.push(totalPages)
		}
		return pages
	}

	const pages = getPages()

	return (
		<Pagination className='justify-content-center mt-3'>
			<Pagination.Prev
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			/>
			{pages.map((page, index) =>
				typeof page === 'number' ? (
					<Pagination.Item
						key={index}
						active={page === currentPage}
						onClick={() => onPageChange(page)}
					>
						{page}
					</Pagination.Item>
				) : (
					<Pagination.Ellipsis key={index} />
				)
			)}
			<Pagination.Next
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			/>
		</Pagination>
	)
}

export default Paginate
