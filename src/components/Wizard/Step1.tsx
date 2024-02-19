import {
	TabPanel,
	Text,
	HStack,
	FormControl,
	Button,
	Flex,
	Icon,
	Select,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaAngleRight, FaCaretRight, FaInfo } from 'react-icons/fa';
import API, { ENDPOINTS } from '@/lib/API';
import { useQuery } from 'react-query';

interface ComissionSettingsProps {
	dset: any;
	setDset: any;
	handleStepChange?: any;
}

export default function Step1({
	handleStepChange,
	dset,
	setDset,
}: ComissionSettingsProps) {
	const { data: plans } = useQuery('plans', () => API.get(ENDPOINTS.plans));

	const [planTypeError, setPlanTypeError] = useState<any>(null);
	const handleNextStep = () => {
		if (!dset['planType']) {
			setPlanTypeError('Plan can not be empty');
		} else {
			handleStepChange();
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
				justifyContent={{ base: 'flex-start', md: 'center' }}
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
						Choose Plan Type
					</Text>
				</HStack>
				<Text
					fontSize="md"
					color="gray.500"
				>
					Choose the plan type that best suits your needs
				</Text>
				<FormControl
					my="30px"
					isInvalid={planTypeError ? true : false}
				>
					<Select
						size="lg"
						onChange={(e) => setDset({ ...dset, planType: e.target.value })}
						placeholder="Select Plan Type"
					>
						{plans?.data?.data?.map((plan: any) => (
							<option
								key={plan._id}
								value={plan._id}
							>
								{plan.name}
							</option>
						))}
					</Select>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{planTypeError}
					</Text>
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
