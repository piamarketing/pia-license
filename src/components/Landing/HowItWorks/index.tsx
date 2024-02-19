// Chakra imports
import {
	Flex,
	Icon,
	Text,
	useColorModeValue,
	Box,
	Heading,
	Button,
} from '@chakra-ui/react';
// Custom components
import Card from '@/lib/ui/horizon/components/card/Card';
import IconBox from '@/lib/ui/horizon/components/icons/IconBox';
import {
	DashCurveDown,
	DashCurveUp,
} from '@/lib/ui/horizon/components/icons/Icons';

// Assets
import { MdCheckCircle, MdComment, MdPersonAddAlt1 } from 'react-icons/md';
import { BsPencil, BsPersonCheck } from 'react-icons/bs';

export default function HowItWorks(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const brandColor = useColorModeValue('brand.500', 'white');
	const dashColor = useColorModeValue('brand.500', 'whiteAlpha.500');
	const shadow = useColorModeValue(
		'0px 18px 40px rgba(112, 144, 176, 0.12)',
		'unset'
	);
	const completeShadow = useColorModeValue(
		'0px 18px 40px rgba(112, 144, 176, 0.12)',
		'inset 0px 4px 4px rgba(255, 255, 255, 0.2)'
	);
	const boxBg = useColorModeValue(
		'white',
		'linear-gradient(180deg, #1F2A4F 0%, #18224D 50.63%, #111C44 100%)'
	);
	return (
		<Box
			p="10px"
			py="10px"
			w="100%"
			{...rest}
		>
			<Heading
				fontWeight={600}
				fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
				lineHeight={'110%'}
				color="black"
				textAlign={'left'}
				w={'100%'}
				mb="60px"
				mt="40px"
			>
				<Text
					as={'span'}
					w={'100%'}
				>
					How It Works ?
				</Text>
			</Heading>
			<Flex
				position="relative"
				direction={{ base: 'column', md: 'row' }}
				justifyContent="center"
			>
				<DashCurveUp
					left={{
						base: '154px',
						lg: '220px',
						xl: '275px',
						'2xl': '185px',
						'3xl': '275px',
					}}
					top="20px"
					position="absolute"
					color={dashColor}
					w={{ base: '100px', lg: '302px' }}
					display={{ base: 'none', md: 'flex' }}
					h="22px"
				/>
				<DashCurveDown
					right={{
						base: '154px',
						lg: '220px',
						xl: '275px',
						'2xl': '185px',
						'3xl': '275px',
					}}
					top="60px"
					position="absolute"
					color={dashColor}
					w={{ base: '100px', lg: '302px' }}
					display={{ base: 'none', md: 'flex' }}
					h="22px"
				/>
				<Flex
					direction="column"
					align="center"
					justify="center"
				>
					<IconBox
						mb="16px"
						w="100px"
						h="100px"
						bg={boxBg}
						shadow={shadow}
						boxShadow={completeShadow}
						icon={
							<Icon
								w="38px"
								h="38px"
								as={BsPencil}
								color={brandColor}
							/>
						}
						zIndex="12"
					/>
					<Text
						textAlign="center"
						color={textColor}
						fontSize="xl"
						fontWeight="700"
						mb="10px"
					>
						Make Your Application
					</Text>
					<Text
						textAlign="center"
						color="secondaryGray.600"
						fontSize="md"
						fontWeight="400"
						maxW="278px"
						mb="70px"
					>
						Send your referral link to friends and your community.
					</Text>
				</Flex>
				<Flex
					mx="60px"
					direction="column"
					align="center"
					justify="center"
				>
					<IconBox
						mb="16px"
						w="100px"
						h="100px"
						bg={boxBg}
						shadow={shadow}
						boxShadow={completeShadow}
						icon={
							<Icon
								w="38px"
								h="38px"
								as={BsPersonCheck}
								color={brandColor}
							/>
						}
						zIndex="12"
					/>
					<Text
						textAlign="center"
						color={textColor}
						fontSize="xl"
						fontWeight="700"
						mb="10px"
					>
						Wait For Review
					</Text>
					<Text
						textAlign="center"
						color="secondaryGray.600"
						fontSize="md"
						fontWeight="400"
						maxW="278px"
						mb="70px"
					>
						Let the new user register with your referral link.
					</Text>
				</Flex>
				<Flex
					direction="column"
					align="center"
					justify="center"
				>
					<IconBox
						mb="16px"
						w="100px"
						h="100px"
						bg={boxBg}
						shadow={shadow}
						boxShadow={completeShadow}
						icon={
							<Icon
								w="38px"
								h="38px"
								as={MdCheckCircle}
								color={brandColor}
							/>
						}
						zIndex="12"
					/>
					<Text
						textAlign="center"
						color={textColor}
						fontSize="xl"
						fontWeight="700"
						mb="10px"
					>
						Start Earning!
					</Text>
					<Text
						textAlign="center"
						color="secondaryGray.600"
						fontSize="md"
						fontWeight="400"
						maxW="278px"
						mb="70px"
					>
						Start earning when your friend do deposit.
					</Text>
				</Flex>
			</Flex>
			<Flex
				direction="column"
				align="center"
				justify="center"
				mb="40px"
			>
				<Button
					width={{ base: '100%', md: '600px' }}
					colorScheme="brand"
					variant="solid"
					size="lg"
					fontSize={'2xl'}
					height={'60px'}
					background={`linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`}
					_hover={{
						background: `linear-gradient(15.46deg, rgb(74, 37, 225) 26.3%, rgb(123, 90, 255) 86.4%)`,
					}}
				>
					Join Us Now To Start Earning!
				</Button>
			</Flex>
		</Box>
	);
}
