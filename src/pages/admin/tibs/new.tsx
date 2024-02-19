import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import {
	Divider,
	HStack,
	Heading,
	useToast,
	Text,
	Box,
	Button,
	Select,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import CustomCard from '@/lib/ui/horizon/components/card/Card';
import products from '../products';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
export default function NewDomain() {
	const { data: clientsData, isLoading } = useQuery('clients', () =>
		API.get(ENDPOINTS.clients)
	);

	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const [domain, setDomain] = useState<any[]>(null);
	const [client, setClient] = useState<string>('');

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.tibs, {
				domain,
				client: session?.client?._id || client,
			});
			router.push('/admin/tibs');
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
			requiredPermission="tibs.create"
			_for="all"
		>
			{!isLoading && (
				<>
					<Create
						sections={[
							{
								title: 'Domain Information',
								formTemplate: [
									[
										{
											type: 'select',
											label: 'Client',
											name: 'client',
											required: true,
											value: client,
											options: clientsData?.data?.data?.map((client: any) => ({
												value: client._id,
												label: client.website,
											})),
											onChangeValue: (e: any) => setClient(e.target.value),
											_for: 'admin',
										},
									],
									[
										{
											type: 'text',
											label: 'Domain',
											name: 'domain',
											required: true,
											value: domain,
											placeholder: 'www.example.com',
											onChangeValue: (e: any) => setDomain(e.target.value),
										},
									],
								],
								onFinish: handleSubmit,
							},
						]}
					/>
				</>
			)}
		</MainContainer>
	);
}
