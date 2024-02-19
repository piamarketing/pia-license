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
	useToast,
} from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import { useRef, useState } from 'react';
import { FaAngleRight, FaCaretRight, FaInfo } from 'react-icons/fa';
import validator from 'validator';
import countriesData from '@/assets/countries.json';
import API, { ENDPOINTS } from '@/lib/API';

interface ComissionSettingsProps {
	dset: any;
	setDset: any;
	handleStepChange?: any;
}

export default function Step4({
	handleStepChange,
	dset,
	setDset,
}: ComissionSettingsProps) {
	const toast = useToast();
	const widgetApi = useRef();
	const widgetApi2 = useRef();

	let error = false;
	const [passportError, setPassportError] = useState<any>(null);
	const [additionalInfoError, setAdditionalInfoError] = useState<any>(null);

	const handleNextStep = async () => {
		if (!dset['passport']) {
			setPassportError('Please select passport document');
			error = true;
		} else {
			setPassportError(null);
		}

		if (!dset['additionalInfo']) {
			setAdditionalInfoError('Please select additional info document');
			error = true;
		} else {
			setAdditionalInfoError(null);
		}

		try {
			const res = await API.post(ENDPOINTS.application, {
				...dset,
			});
			handleStepChange();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

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
						Required Documents
					</Text>
				</HStack>
				<Text
					fontSize="md"
					color="gray.500"
				>
					Please upload required documents
				</Text>

				<FormControl
					my="10px"
					isInvalid={passportError ? true : false}
					w={'100%'}
				>
					<Flex
						w="100%"
						justifyContent="flex-start"
						flexDirection={'column'}
					>
						<FormLabel>Passport</FormLabel>
						<Flex w="100%">
							<Widget
								publicKey="558b23ad07bf127bae7f"
								ref={widgetApi as any}
								onChange={(info) => {
									setDset({
										...dset,
										passport: info.originalUrl,
									});
								}}
							/>
						</Flex>
						<Text
							color="red.400"
							textAlign={'left'}
						>
							{passportError}
						</Text>
					</Flex>
				</FormControl>

				<FormControl
					my="10px"
					isInvalid={additionalInfoError ? true : false}
					w={'100%'}
				>
					<Flex
						w="100%"
						justifyContent="flex-start"
						flexDirection={'column'}
					>
						<FormLabel>Additional Documents</FormLabel>
						<Flex w="100%">
							<Widget
								publicKey="558b23ad07bf127bae7f"
								ref={widgetApi2 as any}
								onChange={(info) => {
									setDset({
										...dset,
										additionalInfo: info.originalUrl,
									});
								}}
							/>
						</Flex>
						<Text
							color="red.400"
							textAlign={'left'}
						>
							{additionalInfoError}
						</Text>
					</Flex>
				</FormControl>

				<Flex
					w="100%"
					justifyContent="flex-end"
					alignItems="center"
				>
					<Button
						mt="20px"
						colorScheme="blue"
						px="50px"
						height="45px"
						onClick={() => handleNextStep()}
						rightIcon={<Icon as={FaAngleRight} />}
					>
						Continue
					</Button>
				</Flex>
			</Flex>
		</TabPanel>
	);
}
