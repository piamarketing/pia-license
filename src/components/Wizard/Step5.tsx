import {
	TabPanel,
	Text,
	HStack,
	FormControl,
	FormLabel,
	SimpleGrid,
	Divider,
	VStack,
	Textarea,
	Button,
	Flex,
	Input,
	Switch,
	Icon,
	Tooltip,
	Select,
	FormErrorMessage,
	Box,
} from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import { useRef, useState } from 'react';
import { FaAngleRight, FaCaretRight, FaInfo } from 'react-icons/fa';
import validator from 'validator';
import countriesData from '@/assets/countries.json';

interface ComissionSettingsProps {
	dset: any;
	setDset: any;
	handleStepChange?: any;
}

export default function Step5({
	handleStepChange,
	dset,
	setDset,
}: ComissionSettingsProps) {
	const widgetApi = useRef();
	const widgetApi2 = useRef();

	return (
		<TabPanel
			w={'100%'}
			h={'100%'}
		>
			<Flex
				w="100%"
				h="100%"
				justifyContent="center"
				flexDirection="column"
				px={{ base: '0px', md: '15rem' }}
				alignItems={'flex-start'}
			>
				<HStack
					pos={'relative'}
					w={'100%'}
				>
					<Text
						fontSize="xl"
						fontWeight="bold"
					>
						Congratulations!
					</Text>
				</HStack>
				<Text
					fontSize="md"
					color="gray.500"
				>
					You have successfully applied. We will contact you as soon as we check
					your application.
				</Text>
			</Flex>
		</TabPanel>
	);
}
