import dynamic from 'next/dynamic'

export default function AdminPagePage() {
	const AdminApp = dynamic(() => import('@/app/control-panel/AdminPage'), {
		ssr: false,
	})
	return <AdminApp />
}
