// Chakra imports
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from '@/lib/ui/horizon/components/card/Card';
import CircularProgress from '@/lib/ui/horizon/components/charts/CircularProgress';
import { VSeparator } from '@/lib/ui/horizon/components/separator/Separator';

interface ConversionProps {
	title: string;
	circleTitle: string;
	description?: string;
	percentage: number;
	leftTitle?: string;
	rightTitle?: string;
	leftValue?: string;
	rightValue?: string;
}

export default function Conversion({
	title,
	circleTitle,
	description,
	percentage,
	leftTitle,
	rightTitle,
	leftValue,
	rightValue,
}: ConversionProps) {
	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');
	return (
		<Card
			p="20px"
			py="30px"
			alignItems="center"
			flexDirection="column"
			w="100%"
			textAlign="center"
		>
			<Text
				color={textColor}
				fontSize="lg"
				fontWeight="700"
				mb="10px"
				mx="auto"
			>
				{title}
			</Text>
			<Text
				color="secondaryGray.600"
				fontSize="sm"
				fontWeight="500"
				maxW="250px"
				mx="auto"
				mb="10px"
			>
				{description}
			</Text>
			<Flex
				justifyContent="center"
				alignItems="center"
				w="100%"
				px="10px"
				mb="8px"
			/>
			<Box
				w="125px"
				mx="auto"
				mb="10px"
			>
				<CircularProgress
					title={circleTitle}
					percentage={percentage}
				/>
			</Box>
			<Card
				bg={cardColor}
				flexDirection="row"
				w="max-content"
				p="15px"
				px="20px"
				mt="auto"
				mx="auto"
			>
				<Flex
					direction="column"
					py="5px"
				>
					<Text
						fontSize="xs"
						color="secondaryGray.600"
						fontWeight="700"
						mb="5px"
					>
						{leftTitle}
					</Text>
					<Text
						fontSize="lg"
						color={textColor}
						fontWeight="700"
					>
						{leftValue}
					</Text>
				</Flex>
				<VSeparator
					ms="70px"
					me="20px"
				/>
				<Flex
					direction="column"
					py="5px"
					me="10px"
				>
					<Text
						fontSize="xs"
						color="secondaryGray.600"
						fontWeight="700"
						mb="5px"
					>
						{rightTitle}
					</Text>
					<Text
						fontSize="lg"
						color={textColor}
						fontWeight="700"
					>
						{rightValue}
					</Text>
				</Flex>
			</Card>
		</Card>
	);
}
