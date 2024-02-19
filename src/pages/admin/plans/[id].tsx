import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { Box, Button, Select, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';

const RenderProducts = ({ productsData, products, setProducts }: any) => {
	const [productsList, setProductsList] = useState<any[]>(products);

	useEffect(() => {
		setProductsList(products);
	}, [products]);

	const handleSetProducts = (e: any) => {
		const newProducts = [...products];
		newProducts.push(e.target.value);
		setProductsList(newProducts);
		setProducts(newProducts);
	};

	return (
		<>
			<>
				{productsList.map((product: any, index: any) => (
					<Box
						key={index}
						display="flex"
						alignItems="center"
						mb={2}
					>
						<Select
							placeholder="Select product"
							defaultValue={product}
							onChange={(e) => handleSetProducts(e)}
							mr="20px"
						>
							{productsData?.data?.data?.map((pr: any) => (
								<option
									key={pr._id}
									value={pr._id}
								>
									{pr.name}
								</option>
							))}
						</Select>
						<Button
							colorScheme="red"
							pl="15px"
							onClick={() => {
								const newProducts = [...products];
								newProducts.splice(index, 1);
								setProductsList(newProducts);
								setProducts(newProducts);
							}}
						>
							Remove
						</Button>
					</Box>
				))}
				<Button
					colorScheme="green"
					onClick={() => {
						const newProducts = [...products];
						newProducts.push('');
						setProductsList(newProducts);
						setProducts(newProducts);
					}}
				>
					Add Product
				</Button>
			</>
		</>
	);
};

export default function NewPlan() {
	const { data: session } = useSession();
	const { data: productsData, isLoading: productsLoading } = useQuery(
		'products',
		() => API.get(ENDPOINTS.products)
	);

	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [products, setProducts] = useState<any[]>(['']);
	const [domainPrice, setDomainPrice] = useState<number>(0);
	const [isReady, setIsReady] = useState<boolean>(false);
	const { id } = router.query;

	const { data, isLoading } = useQuery(
		['plan', id],
		async () => {
			const res = await API.get(ENDPOINTS.plans + '/' + id);
			return res.data;
		},
		{
			enabled: !!id,
		}
	);

	useEffect(() => {
		if (data?.data) {
			console.log(data?.data);
			setName(data?.data?.name);
			setProducts(data?.data?.products);
			setDomainPrice(data?.data?.domainPrice);
			setIsReady(true);
		}
	}, [data]);

	const handleUpdate = async () => {
		try {
			const res = await API.put(ENDPOINTS.plans + '/' + id, {
				client: session?.client?._id,
				name,
				products,
				domainPrice,
			});
			router.push('/admin/plans');
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
			requiredPermission="plans.create"
			_for="admin"
		>
			{!productsLoading && isReady && (
				<Create
					sections={[
						{
							title: 'Plan Information',
							formTemplate: [
								[
									{
										type: 'text',
										label: 'Plan Name',
										placeholder: 'Enter plan name',
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
										type: 'custom',
										label: 'Products',
										name: 'products',
										required: true,
										value: products,
										render: () => (
											<RenderProducts
												products={products}
												setProducts={setProducts}
												productsData={productsData}
											/>
										),
									},
								],
								[
									{
										type: 'number',
										label: 'Domain Price',
										placeholder: 'Enter domain price',
										name: 'domainPrice',
										required: true,
										value: domainPrice,
										onChangeValue: (e: any) => {
											setDomainPrice(e);
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
