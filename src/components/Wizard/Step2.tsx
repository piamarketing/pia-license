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

interface ComissionSettingsProps {
	dset: any;
	setDset: any;
	handleStepChange?: any;
}

export default function Step2({
	handleStepChange,
	dset,
	setDset,
}: ComissionSettingsProps) {
	console.log();
	const [emailError, setEmailError] = useState<any>(null);
	const [passwordError, setPasswordError] = useState<any>(null);
	const [websiteError, setWebsiteError] = useState<any>(null);
	const [phoneError, setPhoneError] = useState<any>(null);
	const [skype, setSkype] = useState<any>(null);
	const [telegram, setTelegram] = useState<any>(null);

	const handleNextStep = () => {
		let error = false;

		if (!dset['email']) {
			setEmailError('Email is required');
		} else {
			if (!validator.isEmail(dset['email'])) {
				setEmailError('Email is invalid');
				error = true;
			} else {
				setEmailError(null);
			}
		}

		if (!dset['password']) {
			setPasswordError('Password is required');
			error = true;
		} else {
			setPasswordError(null);
		}

		if (!dset['website']) {
			setWebsiteError('Website is required');
			error = true;
		} else {
			setWebsiteError(null);
			if (validator.isURL(dset['website'])) {
				setWebsiteError(null);
			} else {
				setWebsiteError('Website is invalid');
			}
		}

		if (!dset['phone']) {
			setPhoneError('Phone is required');
			error = true;
		} else {
			setPhoneError(null);
			if (validator.isMobilePhone(dset['phone'])) {
				setPhoneError(null);
			} else {
				setPhoneError('Phone is invalid');
			}
		}

		if (!dset['skype']) {
			setSkype('Skype is required');
			error = true;
		} else {
			setSkype(null);
		}

		if (!dset['telegram']) {
			setTelegram('Telegram is required');
			error = true;
		} else {
			setTelegram(null);
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
						Account Details
					</Text>
				</HStack>
				<Text
					fontSize="md"
					color="gray.500"
				>
					Choose the plan type that best suits your needs
				</Text>
				<FormControl
					my="10px"
					isInvalid={emailError ? true : false}
				>
					<FormLabel>Email Address</FormLabel>
					<Input
						type="email"
						onChange={(e) => {
							setDset({
								...dset,
								email: e.target.value,
							});
						}}
						size="lg"
						placeholder="Enter your email address"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{emailError}
					</Text>
				</FormControl>
				<FormControl
					isInvalid={passwordError ? true : false}
					my="10px"
				>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						onChange={(e) => {
							setDset({
								...dset,
								password: e.target.value,
							});
						}}
						size="lg"
						placeholder="Enter your password"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{passwordError}
					</Text>
				</FormControl>
				<FormControl
					isInvalid={websiteError ? true : false}
					my="10px"
				>
					<FormLabel>Website</FormLabel>
					<Input
						type="text"
						onChange={(e) => {
							setDset({
								...dset,
								website: e.target.value,
							});
						}}
						size="lg"
						placeholder="Enter your website"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{websiteError}
					</Text>
				</FormControl>
				<FormControl
					isInvalid={phoneError ? true : false}
					my="10px"
				>
					<Flex
						width="100%"
						flexDirection={'column'}
					>
						<FormLabel>Phone Number</FormLabel>

						<Flex
							justify={'flex-start'}
							width="305px"
						>
							<PhoneInput
								country={'us'}
								value={dset['phone']}
								onChange={(phone) => {
									setDset({
										...dset,
										phone: phone,
									});
								}}
								inputStyle={{
									height: '45px',
									fontSize: '1.125rem',
								}}
								buttonStyle={{
									marginRight: '20px',
								}}
							/>
						</Flex>
						<Text
							color="red.400"
							textAlign={'left'}
						>
							{phoneError}
						</Text>
					</Flex>
				</FormControl>
				<FormControl
					isInvalid={skype ? true : false}
					my="10px"
				>
					<FormLabel>Skype</FormLabel>
					<Input
						type="text"
						onChange={(e) => {
							setDset({
								...dset,
								skype: e.target.value,
							});
						}}
						size="lg"
						placeholder="Enter your skype"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{skype}
					</Text>
				</FormControl>
				<FormControl
					isInvalid={telegram ? true : false}
					my="10px"
				>
					<FormLabel>Telegram</FormLabel>
					<Input
						type="text"
						onChange={(e) => {
							setDset({
								...dset,
								telegram: e.target.value,
							});
						}}
						size="lg"
						placeholder="Enter your telegram"
					/>
					<Text
						color="red.400"
						textAlign={'left'}
					>
						{telegram}
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
