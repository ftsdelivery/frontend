class DASHBOARD {
	private root = '/account'

	HOME = this.root
	ORDERS = `${this.root}/orders`
	ORDER = `${this.root}/order/:id`
	PROFILE = `${this.root}/profile`
}

export const DASHBOARD_PAGES = new DASHBOARD()
