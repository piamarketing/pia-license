// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import Card from '@/lib/ui/horizon/components/card/Card';
export default function Statistics(props: {
	illustration: JSX.Element;
	focused?: boolean;
	title: string;
	value: string;
	detail: JSX.Element;
	[x: string]: any;
}) {
	const { illustration, focused, title, value, detail, ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('gray.900', 'white');
	const textColorSecondary = useColorModeValue(
		'secondaryGray.700',
		'secondaryGray.600'
	);
	return (
		<Card
			flexDirection="row"
			w="100%"
			p="15px"
			{...rest}
		>
			<Flex
				align="center"
				justify="space-between"
				w="100%"
			>
				<Flex direction="column">
					<Text
						color={focused ? 'secondaryGray.400' : textColorSecondary}
						fontSize="sm"
						fontWeight="500"
						mb="10px"
						lineHeight="100%"
					>
						{title}
					</Text>
					<Text
						color={focused ? 'white' : textColor}
						fontSize="2xl"
						fontWeight="700"
						lineHeight="100%"
						mb="8px"
					>
						{value}
					</Text>
					{detail}
				</Flex>
				{illustration}
			</Flex>
		</Card>
	);
}
