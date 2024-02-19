// Chakra imports
import {
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Icon,
	HStack,
	Box,
	VStack,
	Image,
	Flex,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
} from '@chakra-ui/react';

import Cookies from 'js-cookie';

import Card from '@/lib/ui/horizon/components/card/Card';
import { useEffect, useRef, useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

export default function WizardHelper() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [hasSavedData, setHasSavedData] = useState(false);
	const [dataset, setDataset] = useState({});
	const [tabIndex, setTabIndex] = useState(0);
	const [activeStep, setActiveStep] = useState(1);

	// On mount, check if there is a saved step
	useEffect(() => {
		const savedStep = Cookies.get('wizard-step');
		const savedData = Cookies.get('wizard-data');

		setHasSavedData(!!savedStep && !!savedData);

		// Open modal if there is a saved step
		if (savedStep) {
			onOpen();
		}
	}, []);

	useEffect(() => {
		if (activeStep > 1) {
			Cookies.set('wizard-step', activeStep.toString());
			Cookies.set('wizard-data', JSON.stringify(dataset));
			console.log('Saved step', activeStep);
		}
	}, [dataset, activeStep]);

	const handleReset = () => {
		Cookies.remove('wizard-step');
		Cookies.remove('wizard-data');
		setHasSavedData(false);
		setTabIndex(0);
		setActiveStep(1);
		setDataset({});

		onClose();
	};

	const handleContinue = () => {
		const savedStep = Cookies.get('wizard-step');
		const savedData = Cookies.get('wizard-data');
		if (savedStep) {
			setTabIndex(parseInt(savedStep) - 1);
			setActiveStep(parseInt(savedStep));
		}

		if (savedData) {
			setDataset(JSON.parse(savedData));
		}
		onClose();
	};
	const STEPS = [
		{
			step: 1,
			title: 'Plan Type',
			description: 'Choose your plan',
			ref: useRef(null),
			tabContent: (
				<Step1
					handleStepChange={() => handleChangeStep(2)}
					dset={dataset}
					setDset={setDataset}
				/>
			),
		},
		{
			step: 2,
			title: 'Account Settings',
			description: 'Enter your account details',
			ref: useRef(null),
			tabContent: (
				<Step2
					handleStepChange={() => handleChangeStep(3)}
					dset={dataset}
					setDset={setDataset}
				/>
			),
		},
		{
			step: 3,
			title: 'Company Information',
			description: 'Enter your company details',
			ref: useRef(null),
			tabContent: (
				<Step3
					handleStepChange={() => handleChangeStep(4)}
					dset={dataset}
					setDset={setDataset}
				/>
			),
		},
		{
			step: 4,
			title: 'Required Documents',
			description: 'Upload your documents',
			ref: useRef(null),
			tabContent: (
				<Step4
					handleStepChange={() => handleChangeStep(5)}
					dset={dataset}
					setDset={setDataset}
				/>
			),
		},
		{
			step: 5,
			title: 'Finish',
			description: 'Finish',
			ref: useRef(null),
			tabContent: (
				<Step5
					handleStepChange={() => handleChangeStep(5)}
					dset={dataset}
					setDset={setDataset}
				/>
			),
		},
	];

	const handleChangeStep = (step: number) => {
		setTabIndex(step - 1);
		setActiveStep(step);
	};

	return (
		<Card
			p="0px"
			py="0"
			alignItems="center"
			flexDirection="column"
			w="100%"
			textAlign="center"
			bg={'gray.50'}
			minH={'100vh'}
		>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				size="xl"
			>
				<ModalOverlay
					w="100vw"
					h="100vh"
				/>
				<ModalContent>
					<ModalHeader>Continue your application</ModalHeader>
					<ModalBody>
						<Text>You have a saved application. Do you want to continue?</Text>
						<Flex
							justifyContent="flex-end"
							mt="30px"
						>
							<Button
								variant="outline"
								colorScheme="red"
								onClick={handleReset}
							>
								Start New Application
							</Button>
							<Button
								colorScheme="blue"
								onClick={handleContinue}
								ml="10px"
							>
								Continue Application
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Tabs
				variant="unstyled"
				isFitted
				w="100%"
				display={{ base: 'block', md: 'flex' }}
				minH={'100vh'}
				justifyContent="center"
				align="center"
				height={'100%'}
				onChange={(index) => setTabIndex(index)}
				index={tabIndex}
			>
				<TabList
					flexDirection={{ base: 'column', md: 'column' }}
					flex="2"
					borderRight="1px solid"
					borderColor="gray.200"
					px="10px"
					py="10px"
					minW={{
						base: '100%',
						md: 'calc(100vw * 0.32)',
					}}
					alignContent={'center'}
				>
					<Flex
						w="100%"
						justifyContent="center"
						mb="60px"
					>
						<Image
							src="/images/logo.png"
							boxSize={'100px'}
						/>
					</Flex>
					{STEPS.map((step, index) => (
						<Tab
							py="4"
							borderRadius="30px"
							transition="all 0.2s"
							maxH="60px"
							ref={step.ref}
							pl="20px"
							mb="25px"
							isDisabled
							_disabled={{
								color: 'black',
							}}
						>
							<HStack w="100%">
								<Box
									bg={activeStep === step.step ? 'blue.500' : 'gray.200'}
									borderRadius="10px"
									w={'57px!important'}
									h={'43px!important'}
									display="flex"
									justifyContent="center"
									alignItems="center"
									fontWeight={'bold'}
									color={'white'}
									mr="10px"
									transition={'all 0.5s'}
								>
									{step.step}
								</Box>
								<VStack
									w="100%"
									alignItems="flex-start"
									spacing={0}
								>
									<Text
										fontSize="lg"
										fontWeight="bold"
										align={'left'}
									>
										{step.title}
									</Text>
									<Text
										fontSize="md"
										color="gray.500"
										align={'left'}
									>
										{step.description}
									</Text>
								</VStack>
							</HStack>
						</Tab>
					))}
				</TabList>
				<TabPanels
					flex="10"
					bg="white"
					boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
					pl="20px"
				>
					{STEPS.map((step, index) => (
						<>{step.tabContent}</>
					))}
				</TabPanels>
			</Tabs>
		</Card>
	);
}
