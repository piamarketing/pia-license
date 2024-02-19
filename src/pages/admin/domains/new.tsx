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
	const [name, setName] = useState<string>('');
	const [domains, setDomains] = useState<any[]>([{}]);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [client, setClient] = useState<string>('');
	const [clientDetail, setClientDetail] = useState<any>(null);
	const [newDomainCount, setNewDomainCount] = useState<number>(1);
	const [domainPrice, setDomainPrice] = useState<number>(0);

	useEffect(() => {
		if (session?.client) {
			setClient(session?.client?._id);
			setDomainPrice(
				parseFloat(
					session?.client?.revisedDomainPrice ||
						session?.client?.planType?.domainPrice
				)
			);
		}
	}, [session]);

	useEffect(() => {
		if (client) {
			const clientDetail = clientsData?.data?.data?.find(
				(cl: any) => cl._id === client
			);
			const domainPricex =
				parseFloat(
					clientDetail?.revisedDomainPrice ||
						clientDetail?.planType?.domainPrice
				) || 0;
			setClientDetail(clientDetail);
			setDomainPrice(domainPricex);
			const total = domains.length * domainPricex;
			setTotalPrice(total);
		}
	}, [client, clientsData]);

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.domains, {
				domains,
				totalPrice,
				client: session?.client?._id || client,
			});
			router.push('/admin/domains');
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

	const handleCalculate = async () => {
		const total = domains.length * domainPrice;
		setTotalPrice(total);
	};

	useEffect(() => {
		handleCalculate();
	}, [domains]);

	const calculateNextDomain = (lastDomain: any) => {
		// Example last domain: is {main: "example1.com", mobile: "m.example1.com"} we will return { main: "example2.com", mobile: "m.example2.com" }
		console.log(lastDomain);
		const regex = /(\d+)(?!.*\d)/g;

		const main = lastDomain?.main?.replace(regex, (match) => {
			return parseInt(match) + 1;
		});
		const mobile = lastDomain?.mobile?.replace(regex, (match) => {
			return parseInt(match) + 1;
		});

		return { main, mobile };
	};

	return (
		<MainContainer
			requiredPermission="domains.create"
			_for="all"
		>
			<HStack
				spacing={4}
				w="100%"
				h="100%"
				justifyContent="flex-start"
				align="flex-start"
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
												options: clientsData?.data?.data?.map(
													(client: any) => ({
														value: client._id,
														label: client.website,
													})
												),
												onChangeValue: (e: any) => setClient(e.target.value),
												_for: 'admin',
											},
										],
										[
											{
												type: 'custom',
												label: 'Domains',
												name: 'domains',
												required: true,
												value: domains,
												render: (domainsHolder: any, setDomainsHolder: any) => (
													<>
														{domainsHolder.map((domain: any, index: any) => (
															<Box
																key={index}
																display="flex"
																alignItems="center"
																mb={2}
															>
																<Input
																	placeholder="Main domain"
																	value={domain.main}
																	onChange={(e) => {
																		// Domain object is like { main: 'example.com', mobile: 'subdomain.example.com' }
																		const newDomains = [...domainsHolder];
																		newDomains[index] = {
																			...newDomains[index],
																			main: e.target.value,
																		};
																		setDomainsHolder(newDomains);
																		setDomains(newDomains);
																	}}
																	mr="20px"
																/>
																<Input
																	placeholder="Mobile domain"
																	value={domain.mobile}
																	onChange={(e) => {
																		const newDomains = [...domainsHolder];
																		newDomains[index] = {
																			...newDomains[index],
																			mobile: e.target.value,
																		};
																		setDomainsHolder(newDomains);
																		setDomains(newDomains);
																	}}
																	mr="20px"
																/>
																<Button
																	colorScheme="red"
																	pl="15px"
																	onClick={() => {
																		const newDomains = [...domainsHolder];
																		newDomains.splice(index, 1);
																		setDomainsHolder(newDomains);
																		setDomains(newDomains);
																	}}
																>
																	-
																</Button>
															</Box>
														))}
														<HStack
															w="100%"
															justify="flex-end"
															my="3"
															mt="20"
														>
															<HStack>
																<Text fontWeight="bold">New Domain Count</Text>
																<NumberInput
																	value={newDomainCount}
																	onChange={(e) => {
																		setNewDomainCount(e);
																	}}
																	min={1}
																	max={100}
																>
																	<NumberInputField />
																	<NumberInputStepper>
																		<NumberIncrementStepper />
																		<NumberDecrementStepper />
																	</NumberInputStepper>
																</NumberInput>
															</HStack>
															<Button
																colorScheme="green"
																onClick={() => {
																	const newDomains = [...domainsHolder];

																	let lastDomain =
																		newDomains[newDomains.length - 1];

																	Array.from(
																		{ length: newDomainCount },
																		(_, i) => i
																	).map(async (i) => {
																		console.log(lastDomain);
																		const f = calculateNextDomain(lastDomain);
																		if (f.main !== '' && f.mobile !== '') {
																			newDomains.push(f);
																			lastDomain = f;
																		} else {
																			newDomains.push({
																				main: '',
																				mobile: '',
																			});
																			lastDomain = {
																				main: '',
																				mobile: '',
																			};
																		}
																	});

																	setDomainsHolder(newDomains);
																	setDomains(newDomains);
																}}
															>
																Add Domain
															</Button>
														</HStack>
													</>
												),
											},
										],
									],
									onFinish: handleSubmit,
								},
							]}
						/>
						<CustomCard title="Domain Information">
							<Heading
								size="md"
								as="h2"
							>
								Invoice
							</Heading>
							<Divider my="5" />
							<HStack
								spacing={4}
								justifyContent="space-between"
								mb="5"
							>
								<Text fontWeight="bold">Unit Price</Text>
								<Text>
									{' '}
									{parseFloat(domainPrice).toLocaleString('en-US', {
										style: 'currency',
										currency: 'EUR',
									})}
								</Text>
							</HStack>
							<HStack
								spacing={4}
								justifyContent="space-between"
								mb="5"
							>
								<Text fontWeight="bold">Quantity</Text>
								<Text>{domains.length}</Text>
							</HStack>
							<HStack
								spacing={4}
								justifyContent="space-between"
								mb="5"
							>
								<Text fontWeight="bold">Total</Text>
								<Text>
									{(totalPrice || 0).toLocaleString('en-US', {
										style: 'currency',
										currency: 'EUR',
									})}
								</Text>
							</HStack>
						</CustomCard>
					</>
				)}
			</HStack>
		</MainContainer>
	);
}
