import {
	Heading,
	Flex,
	Button,
	Icon,
	HStack,
	Box,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import { FiDownload, FiStar, FiUpload, FiX } from 'react-icons/fi';
import Balance from './Balance';
import Statistics from '../MiniStatistics';
import {
	MdOutlineSportsSoccer,
	MdCasino,
	MdSports,
	MdSportsBasketball,
	MdSportsSoccer,
} from 'react-icons/md';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';
import { RiArrowDownCircleFill } from 'react-icons/ri';
import { IoCash } from 'react-icons/io5';
import moment from 'moment';

const PlayerDetails = (data: any) => {
	return (
		<Box>
			<Flex
				direction="row"
				align="center"
				justify="space-between"
				w="100%"
				mb="4"
			>
				<HStack
					align="center"
					justify="center"
				>
					<Heading
						as="h1"
						size="lg"
					>
						{data.data.fullName}
					</Heading>
					<Heading
						as="h1"
						size="sm"
						mt="6px!important"
						color="gray.500"
						fontWeight="normal"
					>
						#{data.data.clientId}
					</Heading>
				</HStack>
				<HStack>
					<Button
						colorScheme="orange"
						leftIcon={<Icon as={FiStar} />}
					>
						Favorite
					</Button>
					<Button
						colorScheme="red"
						leftIcon={<Icon as={FiX} />}
					>
						Block
					</Button>
				</HStack>
			</Flex>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				w="100%"
			>
				<Flex
					flex="3"
					direction="column"
					mr={{ base: 0, md: 4 }}
					w="100%"
				>
					<Balance
						balance={data.data?.balance}
						lastDepositAmount={data.data?.deposit?.lastAmount}
						lastDepositDate={data.data?.deposit?.lastDate}
						firstDepositDate={data.data?.deposit?.firstDate}
					/>
				</Flex>
				<Flex
					flex="10"
					direction="column"
					w="100%"
				>
					<SimpleGrid
						columns={{ base: 1, md: 2, lg: 3 }}
						spacing={2}
					>
						<Statistics
							title={'Total Deposit'}
							value={(data.data?.deposit?.total || 0)?.toLocaleString('tr-TR', {
								style: 'currency',
								currency: 'TRY',
							})}
							detail={<></>}
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
							title={'Sports Stakes'}
							value={(data.data?.sportsbet?.totalStake || 0)?.toLocaleString(
								'tr-TR',
								{
									style: 'currency',
									currency: 'TRY',
								}
							)}
							detail={
								<>
									<Text
										fontSize="sm"
										color="gray.500"
									>
										Last:{' '}
										{moment(data.data?.sportsbet?.lastDate).format(
											'DD.MM.YYYY HH:mm'
										)}
									</Text>
								</>
							}
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
							title={'Casino Stakes'}
							value={(data.data?.casino?.totalStake || 0).toLocaleString(
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
							title={'Total Withdraw'}
							value={(data.data?.withdrawal?.total || 0)?.toLocaleString(
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
							title={'Sports Winnings'}
							value={(data.data?.sportsbet?.totalWin || 0)?.toLocaleString(
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
											as={MdSportsSoccer}
											w="38px"
											h="38px"
											color="white"
										/>
									}
								/>
							}
						/>
						<Statistics
							title={'Casino Winnings'}
							value={(data.data?.casino?.totalWin || 0)?.toLocaleString(
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
						<Statistics
							title={'Deposit/Withdraw Profit'}
							value={(
								(data.data?.deposit?.total || 0) -
								(data.data?.withdrawal?.total || 0)
							)?.toLocaleString('tr-TR', {
								style: 'currency',
								currency: 'TRY',
							})}
							detail={<></>}
							illustration={
								<IconBox
									w="80px"
									h="80px"
									bg="linear-gradient(to right, #ffe000, #799f0c);"
									icon={
										<Icon
											as={IoCash}
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
			</Flex>
		</Box>
	);
};

export default PlayerDetails;
