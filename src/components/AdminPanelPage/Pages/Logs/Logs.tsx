import { getAllLogsWithPages } from '@/services/log.service'
import { Log } from '@/types/log.types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, ButtonGroup, Form } from 'react-bootstrap'
import { toast } from 'sonner'
import styles from './../Orders/Orders.module.css'
import FilterModal from './FilterModal'
import LogsTable from './LogsTable'
import Paginate from './Paginate'
import SortModal from './SortModal'
import ViewSettingsModal from './ViewSettingsModal'

export default function Logs() {
	const [logs, setLogs] = useState<Log[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [itemsPerPage, setItemsPerPage] = useState(50)
	const [showSortModal, setShowSortModal] = useState(false)
	const [showViewSettingsModal, setShowViewSettingsModal] = useState(false)
	const [sortBy, setSortBy] = useState<
		| 'id'
		| 'created_at'
		| 'author_id'
		| 'action_type'
		| 'target_name'
		| 'target_id'
		| 'old_value'
		| 'new_value'
	>('id')
	const [sortLog, setSortLog] = useState<'asc' | 'desc'>('asc')
	const [loading, setLoading] = useState(false)
	const [filters, setFilters] = useState<Partial<Log>>({})
	const [viewSettings, setViewSettings] = useState({
		columns: {
			id: true,
			action: true,
			target: true,
			target_id: true,
			created_at: true,
			updated_at: true,
		},
	})

	const applyFilters = (filters: Partial<Log>) => {
		setFilters(filters)
		setCurrentPage(1)
	}

	const resetFilters = () => {
		setFilters({})
		setCurrentPage(1)
	}

	const handleItemsPerPageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value))
		setCurrentPage(1)
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handleSort = (
		criteria:
			| 'id'
			| 'created_at'
			| 'action_type'
			| 'target_name'
			| 'target_id'
			| 'author_id',
		log: 'asc' | 'desc'
	) => {
		setSortBy(criteria)
		setSortLog(log)
		fetchLogsData()
	}

	const fetchLogsData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getAllLogsWithPages(
				currentPage,
				filters,
				itemsPerPage
			)
			const sortedLogs = response.data.sort((a: any, b: any) => {
				const valueA = a[sortBy]
				const valueB = b[sortBy]

				if (valueA == null || valueB == null) return 0

				if (typeof valueA === 'string' && typeof valueB === 'string') {
					return sortLog === 'asc'
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA)
				}

				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortLog === 'asc' ? valueA - valueB : valueB - valueA
				}

				const dateA = new Date(valueA)
				const dateB = new Date(valueB)

				if (dateA instanceof Date && dateB instanceof Date) {
					return sortLog === 'asc'
						? dateA.getTime() - dateB.getTime()
						: dateB.getTime() - dateA.getTime()
				}

				return 0
			})

			setLogs(sortedLogs)
			setTotalPages(Math.ceil(response.total / itemsPerPage))
		} catch (error) {
			console.error('Ошибка при получении логов:', error)
			toast.error('Ошибка при получении логов')
		} finally {
			setLoading(false)
		}
	}, [currentPage, filters, itemsPerPage, sortBy, sortLog])

	useEffect(() => {
		fetchLogsData()
	}, [fetchLogsData])

	const filteredLogs = useMemo(
		() =>
			logs.filter(
				log =>
					!filters.action_type ||
					log.action_type
						?.toLowerCase()
						.includes(filters.action_type.toLowerCase())
			),
		[logs, filters]
	)

	return (
		<div>
			<ButtonGroup className='mb-3'>
				<Button
					variant='primary'
					title='Фильтровать'
					onClick={() => setShowFilterModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-funnel'></i>
				</Button>
				<Button
					variant='primary'
					title='Сортировать'
					onClick={() => setShowSortModal(true)}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-sort-alpha-down'></i>
				</Button>
				<Button
					variant='primary'
					title='Обновить'
					onClick={fetchLogsData}
					size='sm'
					className={`me-2 ${styles.btn_sucess}`}
				>
					<i className='bi bi-arrow-clockwise'></i>
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Form.Select
					size='sm'
					className='mb-3 ms-2'
					title='Количество строк на странице'
					onChange={handleItemsPerPageChange}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
					<option value={500}>500</option>
				</Form.Select>
			</ButtonGroup>

			{loading ? (
				<Alert
					variant='primary'
					className=' d-flex text-center justify-content-center align-items-center'
				>
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</div>
				</Alert>
			) : filteredLogs.length === 0 ? (
				<Alert variant='info' className='text-center'>
					Таких логов не найдено 😞
				</Alert>
			) : (
				<>
					<LogsTable logs={filteredLogs} />
					<Paginate
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			{showFilterModal && (
				<FilterModal
					show={showFilterModal}
					onHide={() => setShowFilterModal(false)}
					onApply={applyFilters}
					onReset={resetFilters}
					currentFilters={filters}
				/>
			)}

			{showViewSettingsModal && <ViewSettingsModal />}

			{showSortModal && <SortModal />}
		</div>
	)
}
