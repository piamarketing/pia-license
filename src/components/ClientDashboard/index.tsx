import {
	Button,
	Flex,
	Box,
	HStack,
	Icon,
	SimpleGrid,
	Text,
	Slide,
	VStack,
	Divider,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Alert,
	AlertIcon,
	Heading,
	useClipboard,
	Code,
	useToast,
} from '@chakra-ui/react';
import { PermissionGuard } from '../PermissionGuard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomCard from '@/lib/ui/horizon/components/card/Card';
import { FaClipboard, FaGlobe, FaMobileAlt } from 'react-icons/fa';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';
import {
	FiCheck,
	FiDownload,
	FiFile,
	FiFileText,
	FiFlag,
	FiX,
} from 'react-icons/fi';
import Statistics from '../MiniStatistics';
import moment from 'moment';
import API, { ENDPOINTS } from '@/lib/API';
import { useQuery } from 'react-query';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

const Markdown = dynamic(
	() => import('@uiw/react-markdown-preview').then((mod) => mod.default),
	{ ssr: false }
);

interface MainDashboardProps {
	data: any;
	isLoading: boolean;
}

const ClientDashboard = ({ data, isLoading }: MainDashboardProps) => {
	const { onCopy, value, setValue, hasCopied } = useClipboard('');
	const { data: notifications, isLoading: notificationsLoading } = useQuery(
		'notifications',
		() => API.get(ENDPOINTS.notifications),
		{
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		}
	);

	const toast = useToast();
	const router = useRouter();
	const { data: session } = useSession();

	const handleCopy = (text: string) => {
		setValue(text);
		onCopy();

		toast({
			title: 'Copied to clipboard',
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Box>
			{data?.unpaidInvoices.count > 0 && (
				<Alert
					status="error"
					variant="subtle"
				>
					<AlertIcon />
					<Text fontSize="lg">
						You have {data?.unpaidInvoices.count} unpaid invoices with total of{' '}
						{data?.unpaidInvoices.total.toLocaleString('en-US', {
							style: 'currency',
							currency: 'EUR',
						})}
						. Please make a payment to continue using our services.
					</Text>
					<Button
						ml="auto"
						colorScheme="blue"
						onClick={() => router.push('/admin/invoices')}
					>
						Pay now
					</Button>
				</Alert>
			)}
			<SimpleGrid
				columns={{ base: 1, md: 4, lg: 4 }}
				spacing="10px"
				mt="20px"
			>
				<Statistics
					title={'Account Status'}
					value={session?.client?.isActive ? 'Active' : 'Inactive'}
					detail={<></>}
					illustration={
						<IconBox
							w="80px"
							h="80px"
							bg={
								session?.client?.isActive
									? 'linear-gradient(to right, #4cb8c4, #3cd3ad);'
									: 'linear-gradient(to right, #f00000, #dc281e);'
							}
							icon={
								<Icon
									as={session?.client?.isActive ? FiCheck : FiX}
									w="32px"
									h="32px"
									color="white"
								/>
							}
						/>
					}
				/>
				<Statistics
					title={'Pending Support Tickets'}
					value={data.pendingSupportTickets?.count || 0}
					detail={<></>}
					illustration={
						<IconBox
							w="80px"
							h="80px"
							bg="linear-gradient(to right, #2196f3, #f44336);"
							icon={
								<Icon
									as={FiFlag}
									w="32px"
									h="32px"
									color="white"
								/>
							}
						/>
					}
				/>
				<Statistics
					title={'Waiting Invoices'}
					value={data.unpaidInvoices?.count || 0}
					detail={<></>}
					illustration={
						<IconBox
							w="80px"
							h="80px"
							bg="linear-gradient(to right, #f00000, #dc281e);"
							icon={
								<Icon
									as={FiFileText}
									w="32px"
									h="32px"
									color="white"
								/>
							}
						/>
					}
				/>
				<Statistics
					title={'Remaining License'}
					value={
						moment(session?.client?.license?.validUntil).diff(
							moment(),
							'days'
						) > 0
							? moment(session?.client?.license?.validUntil).diff(
									moment(),
									'days'
							  )
							: '0 days'
					}
					detail={<></>}
					illustration={
						<IconBox
							w="80px"
							h="80px"
							bg="linear-gradient(to right, #ff5f6d, #ffc371);"
							icon={
								<Icon
									as={FiFile}
									w="32px"
									h="32px"
									color="white"
								/>
							}
						/>
					}
				/>
			</SimpleGrid>
			<Flex mt="20px">
				<Flex
					flex="1"
					direction="column"
				>
					<CustomCard>
						<VStack
							justify="center"
							align="center"
							px="60px"
							spacing="20px"
						>
							<Icon
								as={FaClipboard}
								w={12}
								h={12}
								color="gray.500"
							/>
							<Heading
								as="h5"
								fontSize="2xl"
							>
								Get Your Script!
							</Heading>
							<Text textAlign="center">
								Further to what we discussed earlier, PAGCOR has launched a new
								licensing system (dynamic seal, updated certificate etc.), so we
								need to update the license on each licensed website within
								7-days
							</Text>
							<Text textAlign="center">
								This one is for {session?.client?.website}
							</Text>
							<Text textAlign="center">
								1. Add the following text to the footer of the website Desktop
								and Mobile Version :
							</Text>
							<Text textAlign="center">
								{session?.client?.website} is licensed and regulated by
								Philippine Amusement and Gaming Corporation Offshore Gaming
								License for Sports Betting & E-Gaming No: 18-0022.
							</Text>
							<Text
								textAlign="center"
								mb="20px"
							>
								2. Open a ticket with bet construct to add the following code:
							</Text>
							<Code
								textAlign="center"
								mt="20px"
							>
								{`<a href="https://verification.pagcorlicenses.ph?domain=${session?.client?.website}" target="_blank"><img src="https://verification.pagcorlicenses.ph/api/validate/logo?domain=${session?.client?.website}" width="100" /></a>`}
							</Code>
							<Button
								colorScheme="blue"
								onClick={() =>
									handleCopy(
										`<a href="https://verification.pagcorlicenses.ph?domain=${session?.client?.website}" target="_blank"><img src="https://verification.pagcorlicenses.ph/api/validate/logo?domain=${session?.client?.website}" width="100" /></a>`
									)
								}
							>
								Copy Code
							</Button>
						</VStack>
					</CustomCard>
					<CustomCard mt="20px">
						<VStack
							justify="flex-start"
							align="flex-start"
						>
							<Heading
								as="h5"
								fontSize="2xl"
							>
								My Domains
							</Heading>
							<HStack
								justify="space-between"
								w="100%"
							>
								<HStack>
									<Text fontWeight="bold">Main Domain</Text>
								</HStack>
								<HStack>
									<Text fontWeight="bold">Mobile Domain</Text>
								</HStack>
							</HStack>

							{session?.client?.domains.length === 0 && (
								<HStack
									justify="center"
									w="100%"
									my="20"
								>
									<Text textAlign="center">No domains found.</Text>
								</HStack>
							)}
							{session?.client?.domains &&
								session?.client?.domains?.map((domain) => (
									<HStack
										key={domain._id}
										justify="space-between"
										w="100%"
									>
										<HStack>
											<Icon as={FaGlobe} />
											<Text>{domain.main}</Text>
										</HStack>
										<HStack>
											<Icon as={FaMobileAlt} />

											<Text>{domain.mobile}</Text>
										</HStack>
									</HStack>
								))}
						</VStack>
					</CustomCard>
				</Flex>
				<Flex
					flex="1"
					ml="20px"
					height="100%"
					width="100%"
					direction="column"
				>
					<SimpleGrid
						columns={{ base: 1, md: 2, lg: 2 }}
						spacing="10px"
						width="100%"
					>
						<Statistics
							title={'Download Your Certificate'}
							value={''}
							detail={
								<>
									<Button
										colorScheme="blue"
										onClick={() => {
											window.open('/api/pdf/' + session?.client?._id, '_blank');
										}}
									>
										Download
									</Button>
								</>
							}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg={
										session?.client?.isActive
											? 'linear-gradient(to right, #4cb8c4, #3cd3ad);'
											: 'linear-gradient(to right, #f00000, #dc281e);'
									}
									icon={
										<Icon
											as={FiDownload}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
					</SimpleGrid>
					<Box
						mt="20px"
						width="100%"
					>
						<Heading
							as="h3"
							fontSize="2xl"
						>
							Lastest News
						</Heading>
						{!notificationsLoading && notifications?.data?.data?.length !== 0 && (
							<>
								{notifications?.data?.data?.map((item, index) => (
									<CustomCard
										key={index}
										mt="20px"
										data-color-mode="light"
									>
										<VStack
											justify="flex-start"
											align="flex-start"
											px="20px"
											spacing="20px"
										>
											<Markdown
												source={item.body}
												style={{ width: '100%' }}
											/>
											<HStack
												justify="flex-end"
												w="100%"
											>
												<Text
													fontSize="sm"
													color="gray.500"
												>
													{moment(item.createdAt).format('DD MMM YYYY')}
												</Text>
											</HStack>
										</VStack>
									</CustomCard>
								))}
							</>
						)}
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
};

export default ClientDashboard;
