// Chakra imports
import {
	Flex,
	Icon,
	IconButton,
	Input,
	Text,
	useToast,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from '@/lib/ui/horizon/components/card/Card';

import { IoLogoFacebook, IoLogoTwitter } from 'react-icons/io';
// Assets
import { IoPaperPlane } from 'react-icons/io5';

export default function Conversion(props: {
	referralCode: string;
	fbLink: string;
	twtLink: string;
	[x: string]: any;
}) {
	const { referralCode, fbLink, twtLink, ...rest } = props;
	const toast = useToast();

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	return (
		<Card
			px="26px"
			py="30px"
			w="100%"
			{...rest}
		>
			<Text
				color={textColor}
				fontSize="2xl"
				fontWeight="700"
				mb="10px"
			>
				Share the referral link
			</Text>
			<Text
				color="secondaryGray.600"
				fontSize="md"
				fontWeight="400"
				mb="30px"
			>
				You can also share your referral link by copying and sending it to your
				friends or sharing it on social media.
			</Text>
			<Flex>
				<Flex
					w={{ base: '80%', md: '100%', '2xl': '75%', '3xl': '378px' }}
					px="18px"
					align="center"
					borderRadius="50px"
					cursor="pointer"
					onClick={function () {
						navigator.clipboard.writeText(referralCode);
						toast({
							title: `Invite link copied!`,
							position: 'top',
							status: 'success',
							isClosable: true,
						});
					}}
					bg={boxBg}
					me="6px"
				>
					<Text
						fontSize="sm"
						fontWeight="500"
						color={textColor}
						w={{ base: '60%', md: '85%', '2xl': '68%', '3xl': '80%' }}
					>
						{referralCode}
					</Text>
					<Text
						ms="auto"
						color={iconColor}
						fontSize="sm"
						fontWeight="500"
					>
						Copy link
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
