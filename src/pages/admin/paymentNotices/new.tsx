import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useRef, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import {
	Select,
	useToast,
	Text,
	VStack,
	Heading,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { Widget } from '@uploadcare/react-widget';
import { FiCreditCard, FiUser } from 'react-icons/fi';

const RenderSelectPaymentMethod = ({
	onSelectPaymentMethod,
	onSelectPaymentAccount,
}: any) => {
	const { data: paymentAccountsData, isLoading: isLoadingPaymentAccounts } =
		useQuery('paymentAccounts', () => API.get(ENDPOINTS.paymentAccounts));
	const [paymentMethod, setPaymentMethod] = useState<string>('');
	const [paymentAccount, setPaymentAccount] = useState<string>('');
	const [availablePaymentAccount, setAvailablePaymentAccount] =
		useState<any>('');

	const handleSelectPaymentMethod = (e: any) => {
		setPaymentMethod(e.target.value);
		onSelectPaymentMethod(e.target.value);

		const availablePaymentAccount = paymentAccountsData?.data?.data?.filter(
			(paymentAccount: any) => paymentAccount.type === e.target.value
		);

		const pickedPaymentAccount =
			availablePaymentAccount[
				Math.floor(Math.random() * availablePaymentAccount.length)
			];

		setAvailablePaymentAccount(pickedPaymentAccount);
		onSelectPaymentAccount(pickedPaymentAccount?._id || '');
	};

	return (
		<>
			<Select
				placeholder="Select payment method"
				onChange={handleSelectPaymentMethod}
			>
				<option value="wise">Wise</option>
			</Select>

			{availablePaymentAccount && (
				<VStack
					mt={4}
					w="100%"
					align="flex-start"
					justify="flex-start"
				>
					{availablePaymentAccount?.name && (
						<VStack
							w="100%"
							align="flex-start"
							justify="flex-start"
						>
							<Text fontWeight="bold">Payment Account Identifier:</Text>
							<HStack>
								<Icon
									as={FiUser}
									color="gray.500"
									mr={2}
								/>
								<Text>{availablePaymentAccount?.name}</Text>
							</HStack>
						</VStack>
					)}
					<VStack
						w="100%"
						align="flex-start"
						justify="flex-start"
					>
						<Text fontWeight="bold">Payment Address:</Text>
						<HStack>
							<Icon
								as={FiCreditCard}
								color="gray.500"
								mr={2}
							/>
							<Text>{availablePaymentAccount?.iban}</Text>
						</HStack>
					</VStack>
				</VStack>
			)}
		</>
	);
};

export default function NewPaymentNotice() {
	const { data: invoicesData, isLoading } = useQuery('invoices', () =>
		API.get(ENDPOINTS.invoices)
	);

	const widgetApi = useRef();
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const [invoice, setInvoice] = useState<string>('');
	const [paymentMethod, setPaymentMethod] = useState<string>('');
	const [paymentDocument, setPaymentDocument] = useState<string>('');
	const [paymentAccount, setPaymentAccount] = useState<string>('');

	useEffect(() => {
		if (router.isReady) {
			setInvoice(router.query.invoice as string);
			console.log(router.query.invoice);
		}
	}, [router.isReady]);

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.paymentNotices, {
				invoice,
				paymentMethod,
				paymentProof: paymentDocument,
				paymentAccount,
				client: session?.client?._id || '',
			});
			router.push('/admin/paymentNotices');
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
			requiredPermission="paymentNotices.create"
			_for="all"
		>
			{!isLoading && router.isReady && (
				<Create
					sections={[
						{
							title: 'Payment Method',
							formTemplate: [
								[
									{
										type: 'custom',
										label: 'Payment Method',
										placeholder: '-',
										name: 'name',
										value: paymentDocument,
										required: true,
										onChangeValue: (e) => setPaymentDocument(e.target.value),
										render: () => (
											<RenderSelectPaymentMethod
												onSelectPaymentMethod={setPaymentMethod}
												onSelectPaymentAccount={setPaymentAccount}
											/>
										),
									},
								],
							],
						},
						{
							title: 'Payment Notice Information',
							formTemplate: [
								[
									{
										type: 'select',
										label: 'Invoice',
										placeholder: 'Select invoice',
										name: 'name',
										value: invoice,
										required: true,
										onChangeValue: (e) => setInvoice(e.target.value),
										options: invoicesData?.data?.data.map((invoice: any) => ({
											label: `Invoice #${invoice._id.slice(0, 5)} ${(
												invoice.totalAmount || 0
											).toLocaleString('en-US', {
												style: 'currency',
												currency: 'EUR',
											})} ${invoice.status}`,
											value: invoice._id,
										})),
									},
								],
								[
									{
										type: 'custom',
										label: 'Payment Document',
										placeholder: 'Select payment document',
										name: 'name',
										value: '',
										required: true,
										render: () => (
											<Widget
												publicKey="558b23ad07bf127bae7f"
												ref={widgetApi as any}
												onChange={(info) => {
													setPaymentDocument(info.originalUrl);
												}}
											/>
										),
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
