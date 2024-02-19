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
	Select,
	IconButton,
	Badge,
} from '@chakra-ui/react';
import Statistics from '@/components/MiniStatistics';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';
import {
	FiArrowRightCircle,
	FiBook,
	FiDownload,
	FiFlag,
	FiGlobe,
	FiLayout,
	FiPaperclip,
	FiPlus,
	FiUpload,
	FiUsers,
} from 'react-icons/fi';
import CircularProgress from '@/lib/ui/horizon/components/charts/CircularProgress';
import Card from '@/lib/ui/horizon/components/card/Card';
import Conversion from '../Conversion';
import { IoCash } from 'react-icons/io5';
import TotalBalance from './TotalBalance';
import { MdCasino, MdOutlineSportsSoccer } from 'react-icons/md';
import Transfer from '@/lib/ui/horizon/components/dataDisplay/Transfer';
import { PermissionGuard } from '../PermissionGuard';
import { useSession } from 'next-auth/react';
import TotalPaidInvoices from './TotalPaidInvoices';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useQuery } from 'react-query';
import dynamic from 'next/dynamic';
const LineChart = dynamic(
	() => import('@/lib/ui/horizon/components/charts/LineChart'),
	{ ssr: false }
);
import {
	lineChartDataOverallRevenue,
	lineChartOptionsOverallRevenue,
} from '@/lib/ui/horizon/variables/charts';
import { RiArrowUpSFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import List from '../List';

interface MainDashboardProps {
	data: any;
	isLoading: boolean;
}

const MainDashboard = ({ data, isLoading }: MainDashboardProps) => {
	const router = useRouter();
	const session = useSession();

	// Like 2022-01-01 -7 days
	const [pData, setPData] = useState({});

	const { data: ticketsData, isLoading: ticketsLoading } = useQuery(
		'tickets',
		() => API.get(ENDPOINTS.tickets),
		{
			refetchOnWindowFocus: false,
		}
	);

	useEffect(() => {
		if (data?.dailyRevenue) {
			// Data coming like {_id: "2023-04-18", total: 3, count: 1}, {_id: "2023-04-15", total: 3, count: 1} we need to format like { name: 'Revenue', data: [3, 3] } with with filling 0 for missing dates
			const formattedDataForRevenue = Array.from({ length: 7 }, (_, i) => {
				const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
				const found = data?.dailyRevenue?.find(
					(item: any) => item?._id === date
				);
				return found ? found.total : 0;
			}).reverse();

			const formattedDataForCount = Array.from({ length: 7 }, (_, i) => {
				const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
				const found = data?.dailyRevenue?.find(
					(item: any) => item?._id === date
				);
				return found ? found.count : 0;
			}).reverse();

			setPData([
				{
					name: 'Revenue',
					data: formattedDataForRevenue,
				},
				{
					name: 'Count',
					data: formattedDataForCount,
				},
			]);
		}
	}, [data?.dailyRevenue]);

	return (
		<Box maxW="100%">
			<Flex
				direction={{ base: 'column', md: 'row' }}
				mb="4"
				w="100%"
			>
				<VStack
					flex="3"
					mr={{ base: '0', md: '4' }}
					direction="column"
				>
					<TotalPaidInvoices balance={data?.invoicesPaid?.total} />
					<TotalPaidInvoices
						balance={data?.invoicesPending?.total}
						title="Pending Invoices"
						bg="yellow.500!important"
					/>
					<Card>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							textAlign={{ base: 'center', md: 'left' }}
						>
							Clients License Status
						</Text>
						<Divider my="4" />
						{data.clients?.map((item: any) => (
							<Transfer
								key={item?._id}
								mb="26px"
								name={item?.website}
								date={moment(item?.license?.validUntil).format('DD MMM YYYY')}
								sum={
									moment(item?.license?.validUntil).diff(moment(), 'days') > 0
										? moment(item?.license?.validUntil).diff(moment(), 'days')
										: '0 days'
								}
							/>
						))}
					</Card>
					<Card>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							textAlign={{ base: 'center', md: 'left' }}
						>
							Lastest Support Tickets
						</Text>
						<Divider my="4" />
						{!data.tickets && (
							<Text
								textAlign="center"
								color="gray.500"
							>
								No tickets found
							</Text>
						)}
						{data.tickets?.map((item: any) => (
							<Transfer
								onClick={() => router.push(`/admin/tickets/${item?._id}`)}
								cursor="pointer"
								key={item?._id}
								mb="26px"
								name={item?.client?.website || '-'}
								// Get the last message from ticket.messages
								date={item?.messages[
									item?.messages.length - 1
								]?.message.substring(0, 20)}
								sum={'Go to support'}
							/>
						))}
					</Card>
					<Card>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							textAlign={{ base: 'center', md: 'left' }}
						>
							Payment Notices
						</Text>
						<Divider my="4" />
						{data.paymentNotices && data.paymentNotices.length === 0 && (
							<Text
								textAlign="center"
								color="gray.500"
							>
								No pending notices found
							</Text>
						)}
						{data.paymentNotices?.map((item: any) => (
							<Transfer
								onClick={() => router.push(`/admin/paymentNotice/${item?._id}`)}
								cursor="pointer"
								key={item?._id}
								mb="26px"
								name={item?.client?.website || '-'}
								date={item?.status === 'pending' ? 'Pending' : 'Paid'}
								sum={(item?.invoice?.totalAmount || 0).toLocaleString('en-US', {
									style: 'currency',
									currency: 'EUR',
								})}
							/>
						))}
					</Card>
				</VStack>
				<Flex
					flex="8"
					direction="column"
					height="100%"
				>
					<Card
						justifyContent="center"
						alignItems="center"
						flexDirection="column"
						w="100%"
						mb={{ base: '20px', lg: '20px' }}
					>
						<Flex
							justify="space-between"
							px="20px"
							pt="5px"
							w="100%"
						>
							<Flex
								align="center"
								w="100%"
							>
								<Flex
									flexDirection="column"
									me="20px"
								>
									<Text
										fontSize="34px"
										fontWeight="700"
										lineHeight="100%"
									>
										{data?.invoicesPaid?.total?.toLocaleString('en-US', {
											style: 'currency',
											currency: 'EUR',
										})}
									</Text>
									<Text
										color="secondaryGray.600"
										fontSize="sm"
										fontWeight="500"
										mt="4px"
									>
										Overall Revenue
									</Text>
								</Flex>
							</Flex>
						</Flex>
						<Box
							minH="260px"
							mt="auto"
							w="100%"
						>
							<LineChart
								chartData={pData}
								chartOptions={{
									...lineChartOptionsOverallRevenue,
									xaxis: {
										...lineChartOptionsOverallRevenue.xaxis,
										// Last 7 days like 2021-01-01
										categories: Array.from({ length: 7 }, (_, i) =>
											moment().subtract(i, 'days').format('YYYY-MM-DD')
										).reverse(),
									},
								}}
							/>
						</Box>
					</Card>
					<SimpleGrid
						columns={{ base: 1, md: 3, lg: 3 }}
						spacing="10px"
					>
						<Statistics
							title={'Total Clients'}
							value={data?.totalClients}
							detail={<></>}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #4cb8c4, #3cd3ad);"
									icon={
										<Icon
											as={FiUsers}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
						<Statistics
							title={'Total Domains'}
							value={data?.totalDomains?.count || 0}
							detail={<></>}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #eecda3, #ef629f);"
									icon={
										<Icon
											as={FiGlobe}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
						<Statistics
							title={'Waiting Support Tickets'}
							value={data?.totalTickets || 0}
							detail={
								<>
									<Button
										size="xs"
										colorScheme="blue"
										variant="outline"
										onClick={() => {
											router.push('/admin/tickets');
										}}
									>
										View Tickets
									</Button>
								</>
							}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #f093fb, #f5576c);"
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
							title={'Total Products'}
							value={data?.totalProducts || 0}
							detail={
								<>
									<Button
										size="xs"
										colorScheme="blue"
										variant="outline"
										onClick={() => {
											router.push('/admin/products');
										}}
									>
										View Products
									</Button>
								</>
							}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #4ca1af, #c4e0e5);"
									icon={
										<Icon
											as={FiBook}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
						<Statistics
							title={'Total Plans'}
							value={data?.totalPlans || 0}
							detail={<></>}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #000000, #434343)"
									icon={
										<Icon
											as={FiLayout}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
						<Statistics
							title={'Total Companies'}
							value={data?.totalCompanies || 0}
							detail={<></>}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #2980b9, #2c3e50)"
									icon={
										<Icon
											as={FiPaperclip}
											w="32px"
											h="32px"
											color="white"
										/>
									}
								/>
							}
						/>
					</SimpleGrid>
				</Flex>
			</Flex>
			{!ticketsLoading && (
				<List
					title="Tickets"
					data={ticketsData?.data?.data}
					isLoading={isLoading}
					rightMenu={(data: any) => (
						<Button
							colorScheme="blue"
							onClick={() => router.push('/admin/tickets/new')}
							leftIcon={<FiPlus />}
						>
							New Ticket
						</Button>
					)}
					cells={[
						{
							label: 'ID',
							renderCell: (row: any) => row._id,
						},
						{
							label: 'Client',
							renderCell: (row: any) => (
								<>
									<PermissionGuard
										requiredPermission="clients.view"
										_for="admin"
									>
										<Text>{row.client?.website || '-'}</Text>
									</PermissionGuard>
									<PermissionGuard
										requiredPermission="clients.view"
										_for="client"
									>
										<Text>-</Text>
									</PermissionGuard>
								</>
							),
						},
						{
							label: 'Subject',
							renderCell: (row: any) => row.subject,
						},
						{
							label: 'Status',
							renderCell: (row: any) => (
								<Badge
									colorScheme={
										row.status === 'open'
											? 'green'
											: row.status === 'closed'
											? 'red'
											: 'yellow'
									}
								>
									{row.status === 'open'
										? 'Open'
										: row.status === 'closed'
										? 'Closed'
										: 'Pending'}
								</Badge>
							),
						},
						{
							label: 'Actions',
							renderCell: (row: any) => (
								<HStack>
									<IconButton
										aria-label="Edit"
										icon={<FiArrowRightCircle />}
										size="xs"
										colorScheme="blue"
										onClick={() => router.push(`/admin/tickets/${row._id}`)}
									/>
								</HStack>
							),
						},
					]}
				/>
			)}
		</Box>
	);
};

export default MainDashboard;
