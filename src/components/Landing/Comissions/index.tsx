import { ReactElement } from 'react';
import {
	Box,
	SimpleGrid,
	Icon,
	Text,
	Stack,
	Flex,
	Heading,
	Image,
	Circle,
	Divider,
	HStack,
	Button,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';
import {
	FaFileArchive,
	FaMoneyBill,
	FaPercentage,
	FaUser,
} from 'react-icons/fa';
import CustomCard from '@/lib/ui/horizon/components/card/Card';

interface FeatureProps {
	title: string;
	text: string;
	icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
	return (
		<Stack>
			<Flex
				w={16}
				h={16}
				align={'center'}
				justify={'center'}
				color={'white'}
				rounded={'full'}
				background={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
				mb={1}
			>
				{icon}
			</Flex>
			<Text fontWeight={600}>{title}</Text>
			<Text color={'gray.600'}>{text}</Text>
		</Stack>
	);
};

export default function SimpleThreeColumns() {
	return (
		<Box
			p={4}
			mt="20px"
		>
			<Heading
				fontWeight={600}
				fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
				lineHeight={'110%'}
				color="black"
				textAlign={'left'}
				w={'100%'}
				mb="60px"
			>
				<Text
					as={'span'}
					w={'100%'}
				>
					Comissions
				</Text>
			</Heading>
			<SimpleGrid
				columns={{ base: 1, md: 3 }}
				spacing={10}
			>
				<CustomCard
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'center'}
					alignContent={'center'}
					w={'100%'}
				>
					<Flex
						justify={'center'}
						my="5px"
						mb="20px"
					>
						<Circle
							size="50px"
							bg={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
						>
							<Icon
								as={FaPercentage}
								color="white"
								w={4}
								h={4}
							/>
						</Circle>
					</Flex>
					<Heading
						fontSize={'2xl'}
						textAlign={'center'}
					>
						25%
					</Heading>
					<Text
						textAlign={'center'}
						color={'gray.500'}
					>
						Commission
					</Text>
					<Divider my="10px" />
					<HStack
						w={'100%'}
						justifyContent={'center'}
					>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺50.000
						</Text>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺150.000
						</Text>
					</HStack>
					<Box
						w={'100%'}
						py="20px"
					>
						<Text
							textAlign={'center'}
							color={'gray.500'}
							px="10"
							fontSize={'sm'}
						>
							You can earn up to 25% commission on the GGR.
						</Text>
					</Box>
					<Flex
						w={'100%'}
						justifyContent={'center'}
					>
						<Button
							colorScheme="blue"
							background={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
							_hover={{
								background: `linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`,
							}}
						>
							Apply Now!
						</Button>
					</Flex>
				</CustomCard>

				<CustomCard
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'center'}
					alignContent={'center'}
					w={'100%'}
				>
					<Flex
						justify={'center'}
						my="5px"
						mb="20px"
					>
						<Circle
							size="50px"
							bg={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
						>
							<Icon
								as={FaPercentage}
								color="white"
								w={4}
								h={4}
							/>
						</Circle>
					</Flex>
					<Heading
						fontSize={'2xl'}
						textAlign={'center'}
					>
						50%
					</Heading>
					<Text
						textAlign={'center'}
						color={'gray.500'}
					>
						Commission
					</Text>
					<Divider my="10px" />
					<HStack
						w={'100%'}
						justifyContent={'center'}
					>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺50.000
						</Text>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺150.000
						</Text>
					</HStack>
					<Box
						w={'100%'}
						py="20px"
					>
						<Text
							textAlign={'center'}
							color={'gray.500'}
							px="10"
							fontSize={'sm'}
						>
							You can earn up to 25% commission on the GGR.
						</Text>
					</Box>
					<Flex
						w={'100%'}
						justifyContent={'center'}
					>
						<Button
							colorScheme="blue"
							background={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
							_hover={{
								background: `linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`,
							}}
						>
							Apply Now!
						</Button>
					</Flex>
				</CustomCard>
				<CustomCard
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'center'}
					alignContent={'center'}
					w={'100%'}
				>
					<Flex
						justify={'center'}
						my="5px"
						mb="20px"
					>
						<Circle
							size="50px"
							bg={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
						>
							<Icon
								as={FaPercentage}
								color="white"
								w={4}
								h={4}
							/>
						</Circle>
					</Flex>
					<Heading
						fontSize={'2xl'}
						textAlign={'center'}
					>
						75%
					</Heading>
					<Text
						textAlign={'center'}
						color={'gray.500'}
					>
						Commission
					</Text>
					<Divider my="10px" />
					<HStack
						w={'100%'}
						justifyContent={'center'}
					>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺50.000
						</Text>
						<Text
							textAlign={'center'}
							color={'blue'}
							fontWeight={'bold'}
							fontSize={'md'}
						>
							₺150.000
						</Text>
					</HStack>
					<Box
						w={'100%'}
						py="20px"
					>
						<Text
							textAlign={'center'}
							color={'gray.500'}
							px="10"
							fontSize={'sm'}
						>
							You can earn up to 25% commission on the GGR.
						</Text>
					</Box>
					<Flex
						w={'100%'}
						justifyContent={'center'}
					>
						<Button
							colorScheme="blue"
							background={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
							_hover={{
								background: `linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`,
							}}
						>
							Apply Now!
						</Button>
					</Flex>
				</CustomCard>
			</SimpleGrid>
			<Flex
				w={'100%'}
				justifyContent={'center'}
				mt="30px"
			>
				<Alert
					status="info"
					w={'100%'}
					borderRadius={'full'}
				>
					<AlertIcon />
					<Text>You can contact us for more than ₺1M monthly deposit </Text>
				</Alert>
			</Flex>
		</Box>
	);
}
