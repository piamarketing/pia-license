import Card from '@/lib/ui/horizon/components/card/Card';
import FixedPlugin from '@/lib/ui/horizon/components/fixedPlugin/FixedPlugin';
import { HSeparator } from '@/lib/ui/horizon/components/separator/Separator';
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	useColorModeValue,
	Text,
	useToast,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
	const toast = useToast();
	const router = useRouter();
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(false);
	const [error, setError] = React.useState('');

	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
	const textColorBrand = useColorModeValue('brand.500', 'white');
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	const handleLogin = async () => {
		const result = await signIn('credentials', {
			redirect: false,
			email,
			password,
		});
		if (result?.error) {
			setError(result.error);
			toast({
				title: 'Error',
				description: result.error,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} else {
			toast({
				title: 'Success',
				description: 'You have been logged in',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});

			router.push('/admin');
		}
	};
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
		>
			<Flex
				direction="column"
				alignSelf="center"
				justifySelf="center"
				overflow="hidden"
				mx={{ base: '10px', lg: '0px' }}
				minH="100vh"
			>
				<FixedPlugin />
				<Box
					position="absolute"
					minH={{ base: '50vh', md: '50vh' }}
					maxH={{ base: '50vh', md: '50vh' }}
					w={{ md: 'calc(100vw)' }}
					maxW={{ md: 'calc(100vw)' }}
					left="0"
					right="0"
					bgRepeat="no-repeat"
					overflow="hidden"
					top="0"
					mx={{ md: 'auto' }}
				/>
				<Card
					w={{ base: '100%', md: 'max-content' }}
					h="max-content"
					mx="auto"
					maxW="100%"
					mt={{ base: '140px', md: '14vh' }}
					mb={{ base: '50px', lg: 'auto' }}
					p={{ base: '10px', md: '50px' }}
					pt={{ base: '30px', md: '50px' }}
				>
					<Flex
						maxW={{ base: '100%', md: 'max-content' }}
						w="100%"
						mx={{ base: 'auto', lg: '0px' }}
						me="auto"
						justifyContent="center"
						px={{ base: '20px', md: '0px' }}
						flexDirection="column"
					>
						<Box me="auto">
							<Heading
								color={textColor}
								fontSize="36px"
								mb="10px"
							>
								Sign In
							</Heading>
							<Text
								mb="36px"
								ms="4px"
								color={textColorSecondary}
								fontWeight="400"
								fontSize="md"
							>
								Enter your email and password to sign in!
							</Text>
						</Box>
						<Flex
							zIndex="2"
							direction="column"
							w={{ base: '100%', md: '420px' }}
							maxW="100%"
							background="transparent"
							borderRadius="15px"
							mx={{ base: 'auto', lg: 'unset' }}
							me="auto"
							mb={{ base: '20px', md: 'auto' }}
						>
							<Flex
								align="center"
								mb="25px"
							></Flex>
							<FormControl>
								<FormLabel
									display="flex"
									ms="4px"
									fontSize="sm"
									fontWeight="500"
									color={textColor}
									mb="8px"
								>
									Email<Text color={brandStars}>*</Text>
								</FormLabel>
								<Input
									isRequired={true}
									variant="auth"
									fontSize="sm"
									ms={{ base: '0px', md: '0px' }}
									type="email"
									placeholder="mail@test.com"
									mb="24px"
									fontWeight="500"
									size="lg"
									onChange={(e) => setEmail(e.target.value)}
								/>
								<FormLabel
									ms="4px"
									fontSize="sm"
									fontWeight="500"
									color={textColor}
									display="flex"
								>
									Password<Text color={brandStars}>*</Text>
								</FormLabel>
								<InputGroup size="md">
									<Input
										isRequired={true}
										fontSize="sm"
										ms={{ base: '0px', md: '4px' }}
										placeholder="Min. 8 characters"
										mb="24px"
										size="lg"
										type={show ? 'text' : 'password'}
										variant="auth"
										onChange={(e) => setPassword(e.target.value)}
									/>
									<InputRightElement
										display="flex"
										alignItems="center"
										mt="4px"
									>
										<Icon
											color={textColorSecondary}
											_hover={{ cursor: 'pointer' }}
											as={show ? FiEye : FiEyeOff}
											onClick={handleClick}
										/>
									</InputRightElement>
								</InputGroup>
								<Flex
									justifyContent="space-between"
									align="center"
									mb="24px"
								>
									<FormControl
										display="flex"
										alignItems="center"
									>
										<Checkbox
											id="remember-login"
											colorScheme="brandScheme"
											me="10px"
											onChange={(e) => setRemember(e.target.checked)}
										/>
										<FormLabel
											htmlFor="remember-login"
											mb="0"
											fontWeight="normal"
											color={textColor}
											fontSize="sm"
										>
											Keep me logged in
										</FormLabel>
									</FormControl>
								</Flex>
								<Button
									fontSize="sm"
									variant="brand"
									fontWeight="500"
									w="100%"
									h="50"
									mb="24px"
									type="submit"
								>
									Sign In
								</Button>
							</FormControl>
						</Flex>
					</Flex>
				</Card>
			</Flex>
		</form>
	);
}
