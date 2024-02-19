import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function NewTicket() {
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const [subject, setSubject] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.tickets, {
				subject,
				client: session?.client?._id,
				category,
			});
			router.push('/admin/tickets');
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
			requiredPermission="tickets.create"
			_for="all"
		>
			<Create
				sections={[
					{
						title: 'Ticket Information',
						formTemplate: [
							[
								{
									type: 'select',
									label: 'Ticket Category',
									placeholder: 'Select ticket category',
									name: 'name',
									value: category,
									options: [
										{
											label: 'Technical Support',
											value: 'Technical Support',
										},
										{
											label: 'Billing',
											value: 'Billing',
										},
										{
											label: 'Setup',
											value: 'Setup',
										},
										{
											label: 'Other',
											value: 'Other',
										},
									],

									required: true,
									onChangeValue: (e: any) => {
										setCategory(e.target.value);
									},
								},
							],
							[
								{
									type: 'text',
									label: 'Ticket Subject',
									placeholder: 'Enter ticket subject',
									name: 'name',
									value: subject,
									required: true,
									onChangeValue: (e: any) => {
										setSubject(e.target.value);
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
