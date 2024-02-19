// @ts-nocheck
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
} from '@chakra-ui/react';
import Statistics from '@/components/MiniStatistics';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';
import { FiDownload, FiUpload } from 'react-icons/fi';
import CircularProgress from '@/lib/ui/horizon/components/charts/CircularProgress';
import Card from '@/lib/ui/horizon/components/card/Card';
import Conversion from '../Conversion';
import { IoCash } from 'react-icons/io5';
import TotalBalance from './TotalBalance';
import { MdCasino, MdOutlineSportsSoccer } from 'react-icons/md';
import Transfer from '@/lib/ui/horizon/components/dataDisplay/Transfer';
import { PermissionGuard } from '../PermissionGuard';
import { useSession } from 'next-auth/react';

interface MainDashboardProps {
	data: any;
	isLoading: boolean;
}

const MainDashboard = ({ data, isLoading }: MainDashboardProps) => {
	const session = useSession();

	const playerDeposits = data?.totals?.totalPlayerDeposits || 0;
	const depositFee =
		data?.merchant?.settings?.commissions?.depositFee?.value || 0;
	const depositInvoice = playerDeposits * (depositFee / 100);

	const playerWithdrawals = data?.totals?.totalPlayerWihdrawal || 0;
	const withdrawalFee =
		data?.merchant?.settings?.commissions?.withdrawalFee?.value || 0;
	const withdrawalInvoice = playerWithdrawals * (withdrawalFee / 100);

	const depositWithdrawalDiff = playerDeposits - playerWithdrawals;

	const sportbetStakes = data?.totals?.sportbetStakes || 0;
	const sportbetWinnings = data?.totals?.sportbetWinnings || 0;
	const sportbetDiff = sportbetStakes - sportbetWinnings;
	const sportbetFee =
		data?.merchant?.settings?.commissions?.sportsbookFee?.value || 0;
	const sportbetInvoice = sportbetDiff * (sportbetFee / 100);

	const casinoStakes = data?.totals?.casinoStakes || 0;
	const casinoWinnings = data?.totals?.casinoWinnings || 0;
	const casinoDiff = casinoStakes - casinoWinnings;
	const casinoFee =
		data?.merchant?.settings?.commissions?.casinoFee?.value || 0;
	const casinoInvoice = casinoDiff * (casinoFee / 100);

	// calculate affliates fees and add to affliatesTotals like 10 + 20 + 30
	const affilatesTotals = data?.affiliates?.map((item: any) => {
		const totalDeposits = item?.totalPlayerDeposits || 0;
		const totalWithdrawals = item?.totalPlayerWithdrawals || 0;
		const fee = item?.group[0]?.rate || 0;
		const total = totalDeposits - totalWithdrawals;
		const invoice = total * (fee / 100);

		// add to affliatesTotals
		return invoice;
	});

	const affliatesTotal = affilatesTotals?.reduce((a: any, b: any) => a + b, 0);

	const totalExpenses =
		depositInvoice +
		withdrawalInvoice +
		sportbetInvoice +
		casinoInvoice +
		affliatesTotal;

	const grandTotal = depositWithdrawalDiff - totalExpenses;
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
					<TotalBalance balance={data.totals?.totalPlayerBalance || 0} />
					<Card>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							textAlign={{ base: 'center', md: 'left' }}
						>
							Top 5 Players by Deposit
						</Text>
						<Divider my="4" />
						{data.top5PlayersByDeposit?.map((item: any) => (
							<Transfer
								key={item?._id}
								mb="26px"
								name={item?.fullName}
								date={item?.username}
								sum={
									'+' +
									(item?.deposit?.total || 0).toLocaleString('tr-TR', {
										style: 'currency',
										currency: 'TRY',
									})
								}
							/>
						))}
					</Card>
					<PermissionGuard
						_for="admin"
						requiredPermission="dashboard.view"
					>
						<Card>
							<Text
								fontSize="lg"
								fontWeight="semibold"
								textAlign={{ base: 'center', md: 'left' }}
							>
								Top 5 Affilliates by Deposit
							</Text>
							<Divider my="4" />
							{data.top5AffiliatesByDeposit?.map((item: any) => (
								<Transfer
									key={item?._id}
									mb="26px"
									name={item?.email}
									date={item?.btag}
									sum={
										'+' +
										(item?.totalDeposit || 0).toLocaleString('tr-TR', {
											style: 'currency',
											currency: 'TRY',
										})
									}
								/>
							))}
						</Card>
					</PermissionGuard>
				</VStack>
				<Flex
					flex="8"
					direction="column"
					height="100%"
				>
					<Flex
						flex="12"
						direction={{ base: 'column', md: 'row' }}
					>
						<Flex
							flex="7"
							direction="column"
							w="100%"
						>
							<SimpleGrid
								columns={{ base: 1, md: 2, lg: 2 }}
								spacing="10px"
							>
								<Statistics
									title={'Total Deposit'}
									value={(
										data.totals?.totalPlayerDeposits || 0
									)?.toLocaleString('tr-TR', {
										style: 'currency',
										currency: 'TRY',
									})}
									detail={
										<>
											<PermissionGuard
												_for="admin"
												requiredPermission="dashboard.view"
											>
												<Text
													fontSize={'xs'}
													fontWeight="semibold"
													color="gray.500"
												>
													aff:{' '}
													{(
														data.totalsWithAffiliates.totalPlayerDeposits || 0
													).toLocaleString('tr-TR', {
														style: 'currency',
														currency: 'TRY',
													})}
													{' (%'}
													{(
														((data.totalsWithAffiliates.totalPlayerDeposits ||
															0) /
															(data.totals?.totalPlayerDeposits || 0)) *
														100
													).toFixed(2)}
													{')'}
												</Text>
											</PermissionGuard>
										</>
									}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #4cb8c4, #3cd3ad);"
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
								<Statistics
									title={'Total Withdraw'}
									value={(
										data.totals?.totalPlayerWihdrawal || 0
									)?.toLocaleString('tr-TR', {
										style: 'currency',
										currency: 'TRY',
									})}
									detail={
										<>
											<PermissionGuard
												_for="admin"
												requiredPermission="dashboard.view"
											>
												<Text
													fontSize={'xs'}
													fontWeight="semibold"
													color="gray.500"
												>
													aff:{' '}
													{(
														data.totalsWithAffiliates.totalPlayerWihdrawal || 0
													).toLocaleString('tr-TR', {
														style: 'currency',
														currency: 'TRY',
													})}
													{' (%'}
													{(
														((data.totalsWithAffiliates.totalPlayerWihdrawal ||
															0) /
															(data.totals?.totalPlayerWihdrawal || 0)) *
														100
													).toFixed(2)}
													{')'}
												</Text>
											</PermissionGuard>
										</>
									}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #d31027, #ea384d);"
											icon={
												<Icon
													as={FiUpload}
													w="32px"
													h="32px"
													color="white"
												/>
											}
										/>
									}
								/>
								<Statistics
									title={'Total Sports Stake'}
									value={(data.totals.sportbetStakes || 0)?.toLocaleString(
										'tr-TR',
										{
											style: 'currency',
											currency: 'TRY',
										}
									)}
									detail={<></>}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #606c88, #3f4c6b);"
											icon={
												<Icon
													as={MdOutlineSportsSoccer}
													w="38px"
													h="38px"
													color="white"
												/>
											}
										/>
									}
								/>
								<Statistics
									title={'Total Sports Winnings'}
									value={(data.totals.sportbetWinnings || 0)?.toLocaleString(
										'tr-TR',
										{
											style: 'currency',
											currency: 'TRY',
										}
									)}
									detail={<></>}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #ff6e7f, #bfe9ff);"
											icon={
												<Icon
													as={MdOutlineSportsSoccer}
													w="38px"
													h="38px"
													color="white"
												/>
											}
										/>
									}
								/>
								<Statistics
									title={'Total Casino Stakes'}
									value={(data.totals.casinoStakes || 0)?.toLocaleString(
										'tr-TR',
										{
											style: 'currency',
											currency: 'TRY',
										}
									)}
									detail={<></>}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #b993d6, #8ca6db);"
											icon={
												<Icon
													as={MdCasino}
													w="38px"
													h="38px"
													color="white"
												/>
											}
										/>
									}
								/>
								<Statistics
									title={'Total Casino Winnings'}
									value={(data.totals.casinoWinnings || 0)?.toLocaleString(
										'tr-TR',
										{
											style: 'currency',
											currency: 'TRY',
										}
									)}
									detail={<></>}
									illustration={
										<IconBox
											w="80px"
											h="80px"
											bg="linear-gradient(to right, #77a1d3, #79cbca, #e684ae);"
											icon={
												<Icon
													as={MdCasino}
													w="38px"
													h="38px"
													color="white"
												/>
											}
										/>
									}
								/>
							</SimpleGrid>
						</Flex>
						<Flex
							flex="1"
							direction="column"
							w="100%"
							ml={{ base: '0', md: '4' }}
						>
							<PermissionGuard
								_for="affiliate"
								requiredPermission="dashboard.view"
							>
								<TotalBalance
									title={'Waiting Comissions'}
									balance={
										// Calculate percantage with session.group.rate

										((data.totals.totalPlayerDeposits || 0) -
											(data.totals.totalPlayerWihdrawal || 0)) *
											(session.data?.group?.rate / 100) -
										(data.totalActivity?.[0]?.total || 0)
									}
									bg="orange"
								/>
								<Box mt="3" />
							</PermissionGuard>
							<Conversion
								title={'Player Deposit Rate'}
								circleTitle={'Deposit Rate'}
								percentage={Math.ceil(
									data.totals.totalPlayerCount
										? (data.totals.totalPlayerWithDeposits /
												data.totals.totalPlayerCount) *
												100
										: 0
								)}
								leftTitle="Total Players"
								rightTitle="Players With Deposit"
								leftValue={data.totals.totalPlayerCount || 0}
								rightValue={data.totals.totalPlayerWithDeposits || 0}
							/>
						</Flex>
					</Flex>
					<PermissionGuard
						_for="admin"
						requiredPermission="dashboard.view"
					>
						<Flex
							mt="3"
							direction={{ base: 'column', md: 'row' }}
							w="100%"
						>
							<Card>
								<Text
									fontSize="lg"
									fontWeight="bold"
								>
									Expenses
								</Text>
								<Divider my="3" />
								<VStack>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Sportsbetting Stakes</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{sportbetStakes.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Sportsbetting Winnings</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{sportbetWinnings.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Sportsbetting Invoice ~</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{(sportbetInvoice || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}{' '}
											{`(${sportbetFee}%)`}
										</Text>
									</SimpleGrid>
									<Divider my="3" />
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Casino Stakes</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{casinoStakes.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Casino Winnings</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{casinoWinnings.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Casino Invoice ~</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{(casinoInvoice || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
											{` (${casinoFee}%)`}
										</Text>
									</SimpleGrid>
									<Divider my="3" />
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Deposit Fees ~</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{(depositInvoice || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
											{` (${depositFee}%)`}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Withdraw Fees ~</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{(withdrawalInvoice || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
											{` (${withdrawalFee}%)`}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Affiliate Fees ~</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{(affliatesTotal || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
										mt="6"
									>
										<Text
											fontWeight={'bold'}
											fontSize={'lg'}
										>
											Total Expanses ~
										</Text>
										<Text
											textAlign={'right'}
											fontWeight="bold"
											fontSize={'lg'}
										>
											{(totalExpenses || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
								</VStack>
							</Card>
							<Card ml="3">
								<Text
									fontSize="lg"
									fontWeight="bold"
								>
									Financial General
								</Text>
								<Divider my="3" />
								<VStack>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Deposits</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{playerDeposits.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Withdraw</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{playerWithdrawals.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>

									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
									>
										<Text>Difference</Text>
										<Text
											textAlign={'right'}
											fontWeight="semibold"
										>
											{depositWithdrawalDiff.toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>

									<Divider my="3" />

									<SimpleGrid
										columns={2}
										spacing={2}
										w="100%"
										mt="6"
									>
										<Text
											fontWeight={'bold'}
											fontSize={'lg'}
										>
											Grand Total ~
										</Text>
										<Text
											textAlign={'right'}
											fontWeight="bold"
											fontSize={'lg'}
										>
											{(grandTotal || 0).toLocaleString('tr-TR', {
												style: 'currency',
												currency: 'TRY',
											})}
										</Text>
									</SimpleGrid>
								</VStack>
							</Card>
						</Flex>
					</PermissionGuard>
				</Flex>
			</Flex>
		</Box>
	);
};

export default MainDashboard;
