import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { Box, Button, Select, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';

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

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.plans, {
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
			requiredPermission="plans.view"
			_for="admin"
		>
			{JSON.stringify(products)}
			{!productsLoading && (
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
										render: (productsHolder: any, setProductsHolder: any) => (
											<>
												{productsHolder.map((product: any, index: any) => (
													<Box
														key={index}
														display="flex"
														alignItems="center"
														mb={2}
													>
														<Select
															placeholder="Select product"
															value={product}
															onChange={(e) => {
																const newProducts = [...productsHolder];
																newProducts[index] = e.target.value;
																setProductsHolder(newProducts);
																setProducts(newProducts);
															}}
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
																const newProducts = [...productsHolder];
																newProducts.splice(index, 1);
																setProductsHolder(newProducts);
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
														const newProducts = [...productsHolder];
														newProducts.push('');
														setProductsHolder(newProducts);
														setProducts(newProducts);
													}}
												>
													Add Product
												</Button>
											</>
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
							onFinish: handleSubmit,
						},
					]}
				/>
			)}
		</MainContainer>
	);
}
