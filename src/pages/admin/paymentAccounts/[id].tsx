import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useRef, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export default function NewPaymentAccount() {
	const [isReady, setIsReady] = useState(false);
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const [type, setType] = useState<string>('');
	const [iban, setIban] = useState<string>('');
	const [name, setName] = useState<string>('');

	const { id } = router.query;

	const { data, isLoading } = useQuery(
		['paymentAccount', id],
		async () => {
			const res = await API.get(ENDPOINTS.paymentAccounts + `/${id}`);
			return res.data;
		},
		{
			enabled: !!id,
		}
	);

	useEffect(() => {
		if (data?.data) {
			setType(data?.data?.type);
			setIban(data?.data?.iban);
			setName(data?.data?.name);
			setIsReady(true);
		}
	}, [data]);

	const handleUpdate = async () => {
		try {
			const res = await API.put(`${ENDPOINTS.paymentAccounts}/${id}`, {
				iban,
				type,
				name,
			});
			router.push('/admin/paymentAccounts');
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
			requiredPermission="paymentAccounts.create"
			_for="admin"
		>
			{!isLoading && isReady && (
				<Create
					sections={[
						{
							title: 'Payment Account Information',
							formTemplate: [
								[
									{
										type: 'text',
										label: 'Account Owner Name',
										placeholder: 'Enter account owner name',
										name: 'name',
										value: name,
										required: false,
										onChangeValue: (e) => setName(e.target.value),
									},
								],
								[
									{
										type: 'text',
										label: 'IBAN',
										placeholder: 'Enter IBAN',
										name: 'iban',
										value: iban,
										required: true,
										onChangeValue: (e) => setIban(e.target.value),
									},
								],
								[
									{
										type: 'select',
										label: 'Payment Method',
										placeholder: 'Select payment method',
										name: 'name',
										value: type,
										required: true,
										onChangeValue: (e) => setType(e.target.value),
										options: [
											{
												label: 'Wise',
												value: 'wise',
											},
											{
												label: 'Crypto',
												value: 'crypto',
											},
										],
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
