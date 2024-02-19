// Chakra imports
import {
	Flex,
	Image,
	Icon,
	Text,
	useColorModeValue,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
} from '@chakra-ui/react';

// Custom components
import Transaction from '@/lib/ui/horizon/components/dataDisplay/Transaction';
import Card from '@/lib/ui/horizon/components/card/Card';
import Statistics from '../MiniStatistics';

// Assets
import balanceImg from '@/lib/ui/horizon/assets/img/dashboards/balanceImg.png';
import fakeGraph from '@/lib/ui/horizon/assets/img/dashboards/fakeGraph.png';

import { FiCheck, FiCreditCard } from 'react-icons/fi';
import moment from 'moment';
import { RiArrowUpSFill } from 'react-icons/ri';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';

const Balance = ({
	balance,
	firstDepositDate,
	lastDepositAmount,
	lastDepositDate,
}: any) => {
	// Ellipsis modals
	const {
		isOpen: isOpen1,
		onOpen: onOpen1,
		onClose: onClose1,
	} = useDisclosure();

	// Chakra Color Mode
	const blueIcon = useColorModeValue('blue.500', 'white');
	const greenIcon = useColorModeValue('green.500', 'white');
	const balanceBg = useColorModeValue('brand.900', '#1B254B');
	return (
		<Card
			flexDirection="column"
			w="100%"
		>
			<Flex
				justify="space-between"
				p="16px"
				mb="20px"
				borderRadius="16px"
				bgColor={balanceBg}
				bgImage={balanceImg.src}
				bgSize="cover"
			>
				<Flex
					align="center"
					justify="space-between"
					w="100%"
				>
					<Flex
						flexDirection="column"
						me="20px"
					>
						<Text
							color="white"
							fontSize="sm"
							fontWeight="500"
						>
							Total Balance
						</Text>
						<Text
							color="white"
							fontSize="34px"
							fontWeight="700"
							lineHeight="100%"
						>
							{(balance || 0)?.toLocaleString('tr-TR', {
								style: 'currency',
								currency: 'TRY',
							})}
						</Text>
					</Flex>
					<Flex
						flexDirection="column"
						ms="auto"
						align="flex-end"
					>
						<Image
							src={fakeGraph.src}
							w="59px"
							h="17px"
							mt="6px"
						/>
					</Flex>
				</Flex>
			</Flex>
			<Flex direction="column">
				<Transaction
					mb="20px"
					name="First Deposit"
					date={moment(firstDepositDate).format('DD MM YYYY, HH:mm')}
					sum=""
					icon={
						<Icon
							as={FiCreditCard}
							color={blueIcon}
							w="20px"
							h="18px"
						/>
					}
				/>
				<Transaction
					name="Last Deposit"
					date={moment(lastDepositDate).format('DD MM YYYY, HH:mm')}
					sum={
						lastDepositAmount?.toLocaleString('tr-TR', {
							style: 'currency',
							currency: 'TRY',
						}) || ''
					}
					icon={
						<Icon
							as={FiCreditCard}
							color={greenIcon}
							w="20px"
							h="18px"
						/>
					}
				/>
			</Flex>
		</Card>
	);
};

export default Balance;
