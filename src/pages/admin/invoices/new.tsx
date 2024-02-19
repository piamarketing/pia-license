import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function NewInvoice() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [product, setProduct] = useState<number>(0);
	const [paymentMethod, setPaymentMethod] = useState<string>('');

	const { data: products, isLoading } = useQuery(
		'products',
		async () => await API.get(ENDPOINTS.products),
		{
			refetchOnWindowFocus: false,
		}
	);

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.invoices, {
				name,
				product,
				paymentMethod,
			});
			router.push('/admin/invoices');
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
			requiredPermission="invoices.create"
			_for="admin"
		>
			{!isLoading && (
				<Create
					sections={[
						{
							title: 'Product Information',
							formTemplate: [
								[
									{
										type: 'select',
										label: 'Product',
										placeholder: 'Select product',
										name: 'product',
										value: product,
										required: true,
										onChangeValue: (e: any) => {
											setProduct(e.target.value);
										},
										options: products?.data?.data?.map((product: any) => ({
											label: `${product.name} (${product.duration} days) - ${(
												product.amount || 0
											).toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}`,

											value: product._id,
										})),
									},
								],
								[
									{
										type: 'select',
										label: 'Payment Method',
										placeholder: 'Select payment method',
										name: 'paymentMethod',
										value: paymentMethod,
										required: true,
										onChangeValue: (e: any) => {
											setPaymentMethod(e.target.value);
										},
										options: [
											{
												label: 'Credit Card',
												value: 'card',
											},
											{
												label: 'Crypto',
												value: 'crypto',
											},
										],
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
