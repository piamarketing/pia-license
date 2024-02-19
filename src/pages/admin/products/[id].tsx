import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
export default function NewProduct() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [price, setPrice] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [type, setType] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [isAffectingLicense, setIsAffectingLicense] = useState<boolean>(false);
	const [service, setService] = useState<any>('');

	const { id } = router.query;
	const { data, isLoading } = useQuery(
		['product', id],
		async () => {
			const res = await API.get(ENDPOINTS.products + `/${id}`);
			return res.data;
		},
		{
			enabled: !!id,
		}
	);

	useEffect(() => {
		if (data?.data) {
			setName(data.data.name);
			setPrice(data.data.price);
			setDescription(data.data.description);
			setType(data.data.type);
			setDuration(data.data.duration);
			setIsAffectingLicense(data.data.isAffectingLicense);
			setService(data.data.service);
		}
	}, [data]);

	const handleUpdate = async () => {
		try {
			const res = await API.put(ENDPOINTS.products + `/${id}`, {
				name,
				description,
				duration,
				type,
				price,
				isAffectingLicense,
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
			requiredPermission="products.view"
			_for="admin"
		>
			{!isLoading && name && (
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
							onFinish: handleUpdate,
						},
					]}
				/>
			)}
		</MainContainer>
	);
}
