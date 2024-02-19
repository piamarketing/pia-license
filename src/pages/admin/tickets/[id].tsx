import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { Box, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Messages from '@/components/Messages';
import { useSession } from 'next-auth/react';

export default function NewTicket() {
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const { id } = router.query;
	const [message, setMessage] = useState<string>('');
	const { data, isLoading, refetch } = useQuery(
		['ticket', id],
		async () => {
			const res = await API.get(ENDPOINTS.tickets + `/${id}`);
			return res.data;
		},
		{
			enabled: !!id,
		}
	);

	const handleUpdate = async (status: string) => {
		try {
			const res = await API.put(`${ENDPOINTS.tickets}/${id}`, {
				status,
			});
			refetch();
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

	const handleSendMessage = async () => {
		try {
			if(!message) return;
			const res = await API.post(`${ENDPOINTS.tickets}/reply/${id}`, {
				message,
				from: session?.client ? 'client' : 'admin',
			});
			refetch();
			setMessage('');
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
			<Box
				w="100%"
				h="100%"
				minH="70vh"
			>
				<Messages
					subject={data?.data?.subject}
					name="lo"
					status={data?.data?.status}
					message={message}
					messages={data?.data?.messages}
					onSendMessage={handleSendMessage}
					onChangeMessage={setMessage}
					handleUpdate={(status: string) => handleUpdate(status)}
					isDisabled={session?._id !== data?.data?.user?._id}
					userNameSurname={data?.data?.user?.nameSurname}
				/>
			</Box>
		</MainContainer>
	);
}
