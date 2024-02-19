import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useRef, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export default function NewPaymentAccount() {
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const [invoice, setInvoice] = useState<string>('');
	const [type, setType] = useState<string>('');
	const [iban, setIban] = useState<string>('');
	const [name, setName] = useState<string>('');

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.paymentAccounts, {
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
						onFinish: handleSubmit,
					},
				]}
			/>
		</MainContainer>
	);
}
