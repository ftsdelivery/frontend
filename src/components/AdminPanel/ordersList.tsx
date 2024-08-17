import {
	Create,
	CreateButton,
	DatagridConfigurable,
	DateField,
	DateInput,
	DeleteWithConfirmButton,
	Edit,
	ExportButton,
	FilterButton,
	List,
	NumberField,
	NumberInput,
	ReferenceField,
	SaveButton,
	SearchInput,
	SelectColumnsButton,
	SelectInput,
	Show,
	SimpleForm,
	SimpleShowLayout,
	TextField,
	TextInput,
	Toolbar,
	TopToolbar,
} from 'react-admin'

const OrdersListActions = () => (
	<TopToolbar>
		<SelectColumnsButton />
		<CreateButton />
		<ExportButton />
		<FilterButton />
	</TopToolbar>
)

const OrdersFilters = [
	<SearchInput source='orders' placeholder='My search' alwaysOn />,
]

const EditToolbar = () => {
	return (
		<Toolbar>
			<SaveButton />
			<DeleteWithConfirmButton
				confirmContent='Вы уверены что хотите удалить заказ?'
				confirmColor='warning'
			/>
		</Toolbar>
	)
}

const ShowToolbar = () => {
	return (
		<Toolbar>
			<DeleteWithConfirmButton
				confirmContent='Вы уверены что хотите удалить заказ?'
				confirmColor='warning'
			/>
		</Toolbar>
	)
}

export const OrderList = () => (
	<List actions={<OrdersListActions />} filters={OrdersFilters}>
		<DatagridConfigurable>
			<NumberField source='id' label='№' />
			<TextField source='status' label='Статус' />
			<DateField source='created_at' label='Создан' showTime />
			<TextField source='user_id' label='Клиент' />
			<TextField source='ip' label='ИП' />
			<TextField source='marketPlace' label='МаркетПлейс' />
			<TextField source='warehouse' label='Склад' />
			<TextField source='delivery_type' label='Тип доставки' />
			<NumberField source='quantity' label='Количество' />
			<TextField source='extra_services' label='Доп. услуги' />
			<DateField source='pickup_date' label='Дата забора' />
			<TextField source='pickup_time' label='Время забора' />
			<TextField source='pickup_address' label='Адрес забора' />
			<TextField source='contact_info' label='Контакты' />
			<TextField source='comment' label='Комментарий' />
			<TextField source='promo_code' label='Промокод' />
			<NumberField
				source='order_price'
				label='Предварительная цена'
				options={{ style: 'currency', currency: 'RUB' }}
			/>
		</DatagridConfigurable>
	</List>
)

export const OrderShow = () => (
	<Show>
		<SimpleShowLayout>
			<TextField source='id' label='№' />
			<TextField source='status' label='Статус' />
			<DateField source='created_at' label='Создан' showTime />
			<TextField source='user_id' label='Клиент' />
			<ReferenceField source='user_id' reference='users' label='Клиент' />
			<TextField source='ip' label='ИП' />
			<TextField source='marketPlace' label='МаркетПлейс' />
			<TextField source='warehouse' label='Склад' />
			<TextField source='delivery_type' label='Тип доставки' />
			<NumberField source='quantity' label='Количество' />
			<TextField source='extra_services' label='Доп. услуги' />
			<DateField source='pickup_date' label='Дата забора' />
			<TextField source='pickup_time' label='Время забора' />
			<TextField source='pickup_address' label='Адрес забора' />
			<TextField source='contact_info' label='Контакты' />
			<TextField source='comment' label='Комментарий' />
			<TextField source='promo_code' label='Промокод' />
			<NumberField
				source='order_price'
				label='Предварительная цена'
				options={{ style: 'currency', currency: 'RUB' }}
			/>
		</SimpleShowLayout>
	</Show>
)

export const OrderEdit = () => (
	<Edit>
		<SimpleForm toolbar={<EditToolbar />}>
			<SelectInput
				source='status'
				label='Статус'
				choices={[
					{ id: 'PENDING', name: 'В ожидании' },
					{ id: 'CONFIRMED', name: 'Подверждено' },
					{ id: 'CANCELED', name: 'Отменено' },
					{ id: 'DELIVERED', name: 'Доставлено' },
				]}
			/>
			<TextInput source='ip' label='ИП' />
			<TextInput source='marketPlace' label='Маркет Плейс' />
			<TextInput source='warehouse' label='Склад' />
			<TextInput source='delivery_type' label='Тип доставки' />
			<TextInput source='quantity' label='Количество' />
			<TextInput source='extra_services' label='Доп. услуги' />
			<TextInput source='pickup_date' label='Дата забора' />
			<TextInput source='pickup_time' label='Время забора' />
			<TextInput source='pickup_address' label='Адрес забора' />
			<TextInput source='contact_info' label='Контакты' />
			<TextInput source='comment' label='Комментарий' />
			<TextInput source='promo_code' label='Промокод' />
			<TextInput source='order_price' label='Предварительная цена' />
		</SimpleForm>
	</Edit>
)

export const OrderCreate = () => (
	<Create>
		<SimpleForm>
			<NumberInput source='user_id' label='ID Клиента' />
			<NumberInput source='ip' label='ИП' />
			<SelectInput
				source='marketPlace'
				label='Маркет Плейс'
				choices={[
					{ id: 'Яндекс Маркет', name: 'Яндекс Маркет' },
					{ id: 'Озон', name: 'Озон' },
					{ id: 'ВайлдБерриес', name: 'ВайлдБерриес' },
				]}
			/>
			<SelectInput
				source='warehouse'
				label='Склад'
				choices={[
					{ id: 'Склад 1', name: 'Склад 1' },
					{ id: 'Склад 2', name: 'Склад 2' },
					{ id: 'Склад 3', name: 'Склад 3' },
				]}
			/>
			<SelectInput
				source='delivery_type'
				label='Тип доставки'
				choices={[
					{ id: 'Паллеты', name: 'Паллеты' },
					{ id: 'Коробки', name: 'Коробоки' },
				]}
			/>
			<NumberInput source='quantity' label='Количество' />
			<SelectInput
				source='extra_services'
				label='Доп. услуги'
				choices={[
					{ id: 'Паллет', name: 'Паллет' },
					{ id: 'Паллетирование', name: 'Паллетирование' },
					{ id: 'Всё вместе', name: 'Всё вместе' },
					{ id: 'Без доп. услуг', name: 'Без доп. услуг' },
				]}
			/>
			<DateInput source='pickup_date' label='Дата забора' />
			<SelectInput
				source='pickup_time'
				label='Время забора'
				choices={[
					{ id: '10:00-11:00', name: '10:00-11:00' },
					{ id: '12:00-13:00', name: '12:00-13:00' },
					{ id: '14:00-15:00', name: '14:00-15:00' },
					{ id: '16:00-17:00', name: '16:00-17:00' },
				]}
			/>
			<TextInput source='pickup_address' label='Адрес забора' />
			<TextInput source='contact_info' label='Контакты' />
			<TextInput source='comment' label='Комментарий' />
			<TextInput source='promo_code' label='Промокод' />
			<NumberInput source='order_price' label='Предварительная цена' />
		</SimpleForm>
	</Create>
)
