import {
	Datagrid,
	DateField,
	Edit,
	EmailField,
	List,
	NumberField,
	SelectInput,
	Show,
	SimpleForm,
	SimpleShowLayout,
	TextField,
	TextInput,
} from 'react-admin'

export const UsersList = () => (
	<List>
		<Datagrid>
			<NumberField source='id' label='ID' />
			<DateField source='created_at' label='Дата регистрации' />
			<EmailField source='email' label='Почта' />
			<TextField source='name' label='Имя, Фамилия' />
			<TextField source='role' label='Роль' />
			<TextField source='used_promo_codes' label='Использованые промокоды' />
			<NumberField source='orders_count' label='Количество заявок' />
		</Datagrid>
	</List>
)

export const UserShow = () => (
	<Show>
		<SimpleShowLayout>
			<TextField source='id' label='ID' />
			<DateField source='created_at' label='Дата регистрации' />
			<EmailField source='email' label='Почта' />
			<TextField source='name' label='Имя' />
			<TextField source='role' label='Роль' />
			<TextField source='used_promo_codes' label='Использованные промокоды' />
			<NumberField source='orders_count' label='Количество заявок' />
		</SimpleShowLayout>
	</Show>
)
export const UserEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source='email' />
			<TextInput source='name' />
			<SelectInput
				source='role'
				label='Роль'
				choices={[
					{ id: 'USER', name: 'Пользователь' },
					{ id: 'ADMIN', name: 'Администратор' },
				]}
			/>
		</SimpleForm>
	</Edit>
)
