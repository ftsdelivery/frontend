import {
	BooleanField,
	Create,
	Datagrid,
	DateField,
	Edit,
	List,
	NumberField,
	NumberInput,
	SelectInput,
	Show,
	SimpleForm,
	SimpleShowLayout,
	TextField,
	TextInput,
} from 'react-admin'

export const PromoCodesList = () => (
	<List>
		<Datagrid>
			<TextField source='code' label='Промокод' />
			<NumberField source='discount' label='Скидка в %' />
			<DateField source='created_at' label='Действует с' />
			<BooleanField source='is_active' label='Активен' />
			<TextField source='author_id' label='Автор' />
			<NumberField source='count_of_uses' label='Количество использований' />
			<NumberField source='limit_of_uses' label='Макс. использований' />
		</Datagrid>
	</List>
)

export const PromoCodeShow = () => (
	<Show>
		<SimpleShowLayout>
			<TextField source='code' label='Промокод' />
			<NumberField source='discount' label='Скидка в %' />
			<DateField source='created_at' label='Действует с' />
			<BooleanField source='is_active' label='Активен' />
			<TextField source='author_id' label='Автор' />
			<NumberField source='count_of_uses' label='Количество использований' />
			<NumberField source='limit_of_uses' label='Макс. использований' />
		</SimpleShowLayout>
	</Show>
)

export const PromoCodeEdit = async () => {
	return (
		<Edit>
			<SimpleForm>
				<NumberInput source='discount' />
				<SelectInput
					source='is_active'
					label='Статус'
					choices={[
						{ id: 'true', name: 'Активный' },
						{ id: 'false', name: 'Не активный' },
					]}
				/>
				<NumberInput source='limit_of_uses' />
			</SimpleForm>
		</Edit>
	)
}

export const PromoCodeCreate = async () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput
					source='author_id'
					defaultValue={'1'}
					label='Автор промокода'
					disabled
				/>
				<TextInput source='code' label='Название промокода' />
				<NumberInput source='discount' label='Процент скидки' />
				<SelectInput
					source='is_active'
					label='Статус промокода'
					choices={[
						{ id: 'true', name: 'Активный' },
						{ id: 'false', name: 'Не активный' },
					]}
				/>
				<NumberInput source='limit_of_uses' label='Количество использований' />
			</SimpleForm>
		</Create>
	)
}
