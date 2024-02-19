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
import PhoneInput from 'react-phone-input-2';
import countriesData from '@/assets/countries.json';
interface ComissionSettingsProps {
	dset: any;
	setDset: any;
	handleStepChange?: any;
}

export default function Step3({
	handleStepChange,
	dset,
	setDset,
}: ComissionSettingsProps) {
	const [providerError, setProviderError] = useState<any>(null);
	const [companyError, setCompanyError] = useState<any>(null);
	const [companyCodeError, setCompanyCodeError] = useState<any>(null);
	const [countryError, setCountryError] = useState<any>(null);
	const [addressError, setAddressError] = useState<any>(null);
	const [firstNameError, setFirstNameError] = useState<any>(null);
	const [lastNameError, setLastNameError] = useState<any>(null);
	const [contactEmailError, setContactEmailError] = useState<any>(null);

	const handleNextStep = () => {
		let error = false;

		if (!dset['provider']) {
			setProviderError('Please select gaming provider');
			error = true;
		} else {
			setProviderError(null);
		}

		if (!dset['company']) {
			setCompanyError('Please enter company name');
			error = true;
		} else {
			setCompanyError(null);
		}

		if (!dset['companyCode']) {
			setCompanyCodeError('Please enter company code');
			error = true;
		} else {
			setCompanyCodeError(null);
		}

		if (!dset['country']) {
			setCountryError('Please select country');
			error = true;
		} else {
			setCountryError(null);
		}

		if (!dset['address']) {
			setAddressError('Please enter address');
			error = true;
		} else {
			setAddressError(null);
		}

		if (!dset['firstName']) {
			setFirstNameError('Please enter first name');
			error = true;
		} else {
			setFirstNameError(null);
		}

		if (!dset['lastName']) {
			setLastNameError('Please enter last name');
			error = true;
		} else {
			setLastNameError(null);
		}

		if (!dset['contactEmail']) {
			setContactEmailError('Please enter contact email');
			error = true;
		} else {
			setContactEmailError(null);
		}

		if (!error) {
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
						Company Information
					</Text>
				</HStack>
				<Text
					fontSize="md"
					color="gray.500"
				>
					Please fill in the following information
				</Text>
				<FormControl
					my="10px"
					isInvalid={providerError ? true : false}
				>
					<FormLabel>Gaming Provider</FormLabel>
					<Select
						onChange={(e) => {
							setDset({
								...dset,
								provider: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please select gaming provider"
					>
						<option value="pronet">Pronet Gaming</option>
						<option value="betconstruct">BetConstruct</option>
						<option value="digitain">Digitain</option>
						<option value="XLarge">XLarge</option>
						<option value="betsource">Betsource</option>
						<option value="betgames">Betgames</option>
						<option value="everymatrix">EveryMatrix</option>
						<option value="wanda">Wanda Play</option>
						<option value="idnup">Idn Up</option>
						<option value="other">Other</option>
					</Select>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{providerError}
					</Text>
				</FormControl>
				<FormControl
					my="10px"
					isInvalid={companyError ? true : false}
				>
					<FormLabel>Company Name</FormLabel>
					<Input
						onChange={(e) => {
							setDset({
								...dset,
								company: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please enter company name"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{companyError}
					</Text>
				</FormControl>
				<FormControl
					my="10px"
					isInvalid={companyCodeError ? true : false}
				>
					<FormLabel>Company Code</FormLabel>
					<Input
						onChange={(e) => {
							setDset({
								...dset,
								companyCode: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please enter company code"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{companyCodeError}
					</Text>
				</FormControl>
				<FormControl
					my="10px"
					isInvalid={countryError ? true : false}
				>
					<FormLabel>Country</FormLabel>
					<Select
						onChange={(e) => {
							setDset({
								...dset,
								country: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please select country"
					>
						{countriesData.map((country) => (
							<option value={country.country}>{country.country}</option>
						))}
					</Select>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{countryError}
					</Text>
				</FormControl>
				<FormControl
					my="10px"
					isInvalid={addressError ? true : false}
				>
					<FormLabel>Address</FormLabel>
					<Textarea
						onChange={(e) => {
							setDset({
								...dset,
								address: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please enter address"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{addressError}
					</Text>
				</FormControl>
				<HStack
					w="100%"
					justifyContent="space-between"
				>
					<FormControl
						my="10px"
						isInvalid={firstNameError ? true : false}
					>
						<FormLabel>First Name</FormLabel>
						<Input
							onChange={(e) => {
								setDset({
									...dset,
									firstName: e.target.value,
								});
							}}
							size="lg"
							placeholder="Please enter first name"
						/>
						<Text
							color="red.400"
							textAlign={'left'}
						>
							{firstNameError}
						</Text>
					</FormControl>
					<FormControl
						my="10px"
						isInvalid={lastNameError ? true : false}
					>
						<FormLabel>Last Name</FormLabel>
						<Input
							onChange={(e) => {
								setDset({
									...dset,
									lastName: e.target.value,
								});
							}}
							size="lg"
							placeholder="Please enter last name"
						/>
						<Text
							color="red.400"
							textAlign={'left'}
						>
							{lastNameError}
						</Text>
					</FormControl>
				</HStack>
				<FormControl
					my="10px"
					isInvalid={contactEmailError ? true : false}
				>
					<FormLabel>Contact Email</FormLabel>
					<Input
						onChange={(e) => {
							setDset({
								...dset,
								contactEmail: e.target.value,
							});
						}}
						size="lg"
						placeholder="Please enter email"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{contactEmailError}
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
