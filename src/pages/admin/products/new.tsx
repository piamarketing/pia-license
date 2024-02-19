import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function NewProduct() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [price, setPrice] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [type, setType] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [service, setService] = useState<string>('');

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.products, {
				name,
				description,
				duration,
				type,
				price,
				service,
			});
			router.push('/admin/products');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
		}
	};

	return (
		<MainContainer
			requiredPermission="products.create"
			_for="admin"
		>
			<Create
				sections={[
					{
						title: 'Product Information',
						formTemplate: [
							[
								{
									type: 'text',
									label: 'Product Name',
									placeholder: 'Enter product name',
									name: 'name',
									value: name,
									required: true,
									onChangeValue: (e: any) => {
										setName(e.target.value);
									},
								},
							],
							[
								{
									type: 'select',
									label: 'Type',
									placeholder: 'Select type',
									name: 'type',
									value: type,
									required: true,
									onChangeValue: (e: any) => {
										setType(e.target.value);
									},
									options: [
										{
											label: 'One Time',
											value: 'one_time',
										},
										{
											label: 'Recurring',
											value: 'recurring',
										},
									],
								},
								{
									type: 'number',
									label: 'Duration',
									placeholder: 'Enter duration',
									name: 'duration',
									value: duration,
									required: true,
									onChangeValue: (e: any) => {
										setDuration(e);
									},
								},
							],
							[
								{
									type: 'number',
									label: 'Price',
									placeholder: 'Enter price',
									name: 'price',
									value: price,
									required: true,
									onChangeValue: (e: any) => {
										setPrice(e);
									},
								},
							],
							[
								{
									type: 'textarea',
									label: 'Description',
									placeholder: 'Enter description',
									name: 'description',
									value: description,
									required: true,
									onChangeValue: (e: any) => {
										setDescription(e.target.value);
									},
								},
							],
							[
								{
									type: 'select',
									label: 'Service',
									placeholder: 'Select service',
									name: 'service',
									value: service,
									required: true,
									options: [
										{
											label: 'License',
											value: 'license',
										},
										{
											label: 'Infrastructure',
											value: 'infrastructure',
										},
										{
											label: 'Affiliate',
											value: 'affiliate',
										},
										{
											label: 'Graphic Design',
											value: 'graphic_design',
										},
										{
											label: 'Web Design',
											value: 'web_design',
										},
									],

									onChangeValue: (e: any) => {
										setService(e.target.value);
									},
								},
							],
						],
						onFinish: handleSubmit,
					},
				]}
			/>
		</MainContainer>
	);
}
