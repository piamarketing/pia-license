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
} from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';
import { FaFileArchive, FaMoneyBill, FaUser } from 'react-icons/fa';

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
			mt="40px"
			mb="100px"
		>
			<Heading
				fontWeight={600}
				fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
				lineHeight={'110%'}
				color="black"
				textAlign={'center'}
				w={'100%'}
				mb="60px"
			>
				<Text
					as={'span'}
					w={'100%'}
				>
					Discover our benefits
					<Box
						display={'flex'}
						width={'100%'}
						justifyContent={'center'}
					>
						<Image
							src="/images/line.svg"
							alt="hero"
						/>
					</Box>
				</Text>
			</Heading>
			<SimpleGrid
				columns={{ base: 1, md: 3 }}
				spacing={10}
			>
				<Feature
					icon={
						<Icon
							as={FaUser}
							w={10}
							h={10}
							p="10px"
						/>
					}
					title={'Lifetime Support'}
					text={
						'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
					}
				/>
				<Feature
					icon={
						<Icon
							as={FaFileArchive}
							w={10}
							h={10}
							p="10px"
						/>
					}
					title={'Unlimited Donations'}
					text={
						'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
					}
				/>
				<Feature
					icon={
						<Icon
							as={FaMoneyBill}
							w={10}
							h={10}
							p="10px"
						/>
					}
					title={'Instant Delivery'}
					text={
						'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
					}
				/>
			</SimpleGrid>
		</Box>
	);
}
