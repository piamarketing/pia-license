// @ts-nocheck
import {
	Button,
	Flex,
	Box,
	Text,
	HStack,
	Spinner,
	VStack,
	useToast,
	Icon,
	Center,
} from '@chakra-ui/react';
import SidebarMenu, { DesktopSidebar } from '@/components/Sidebar';
import Menu from '@/components/Menu';
import { signIn, signOut, useSession } from 'next-auth/react';
import API, { ENDPOINTS } from '@/lib/API';
import { useQuery } from 'react-query';
import Card from '@/lib/ui/horizon/components/card/Card';
import moment from 'moment';
import { FiCheckCircle, FiChevronLeft, FiX } from 'react-icons/fi';
import { usePermission } from '@/hooks/usePermission';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
interface MainContainerProps {
	requiredPermission: string;
	_for: string;
	children: React.ReactNode;
}

const MainContainer = ({
	requiredPermission,
	_for,
	children,
}: MainContainerProps) => {
	const [isLoadingPerm, setIsLoadingPerm] = useState(true);
	const router = useRouter();
	const permission = usePermission(requiredPermission, _for);
	const toast = useToast();
	const session = useSession();
	const { data, isLoading } = useQuery(
		'merchant',
		() => API.get(`${ENDPOINTS.merchants}/${session?.data?.merchant?._id}`),
		{ enabled: !!session?.data?.merchant?._id, refetchInterval: 5000 }
	);

	useEffect(() => {
		if (permission === 'waiting') {
			setIsLoadingPerm(true);
		}
		if (permission === 'pass') {
			setIsLoadingPerm(false);
		}
		if (permission === 'unauthenticated') {
			router.push('/auth/login');
		}
		setIsLoadingPerm(false);
	}, [permission]);

	const handleDontActAsClient = async () => {
		try {
			await API.post(`${ENDPOINTS.users}/toggle-acting`, {
				id: null,
			});
			toast({
				title: 'Success',
				description: 'Redirecting to dashboard',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			window.location.href = '/admin';
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<>
			{isLoadingPerm && (
				<Center h="100vh">
					<Spinner />
				</Center>
			)}
			{permission === 'block' && (
				<Center h="100vh">
					<VStack>
						<Icon
							as={FiX}
							fontSize="5xl"
						/>
						<Box>Bu sayfaya erişemeye yetkiniz yoktur.</Box>
						<Box>Lütfen destek biriminden destek alınız.</Box>
					</VStack>
				</Center>
			)}
			{permission === 'pass' && (
				<Box
					// Our zoom is 0.75 so calculate the height with vh and math calc
					h="100vh"
					pos="relative"
				>
					<Flex>
						<SidebarMenu />
						<Flex
							w="100%"
							flexDirection="column"
							flex="12"
						>
							{/* 
					<Button
						onClick={() => {
							signIn();
						}}
					>
						Sign In
					</Button>
					<Button
						onClick={() => {
							signOut();
						}}
					>
						Sign Out
					</Button>
					*/}
							<Menu
								brandText="Admin Panel"
								logoText="H"
								secondary={false}
								fixed={false}
								onOpen={() => {}}
							/>
							<Box
								px={{ base: '10px', md: '60px' }}
								py="20px"
							>
								{children}
							</Box>
						</Flex>
					</Flex>
					<Box
						pos="fixed"
						bottom="7"
						right="5"
						cursor="pointer"
					>
						<VStack>
							{session?.data?.isActingAsClient && (
								<Button
									borderRadius="full"
									py="2"
									px="7"
									boxShadow="0px 0px 10px 0px rgba(0,0,0,0.2)"
									leftIcon={<Icon as={FiChevronLeft} />}
									colorScheme="orange"
									onClick={handleDontActAsClient}
								>
									<Text
										fontWeight="semibold"
										fontSize={'md'}
									>
										Go back to admin Panel
									</Text>
								</Button>
							)}
						</VStack>
					</Box>
				</Box>
			)}
		</>
	);
};

export default MainContainer;
