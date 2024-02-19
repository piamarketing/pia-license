/* eslint-disable */
// Chakra Imports
import {
	Badge,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	HStack,
	Link,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import HeaderLinks from './Links';
import { useRouter } from 'next/router';
import CustomCard from '@/lib/ui/horizon/components/card/Card';
import { PermissionGuard } from '../PermissionGuard';
import { useSession } from 'next-auth/react';
import moment from 'moment';

export default function Menu(props: {
	secondary: boolean;
	brandText: string;
	logoText: string;
	fixed: boolean;
	onOpen: (...args: any[]) => any;
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, brandText } = props;

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed' as const;
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue(
		'rgba(244, 247, 254, 0.2)',
		'rgba(11,20,55,0.5)'
	);
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	return (
		<Box
			boxShadow={navbarShadow}
			//bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition="center"
			backgroundSize="cover"
			borderRadius="16px"
			borderWidth="1.5px"
			borderStyle="solid"
			transitionDelay="0s, 0s, 0s, 0s"
			transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
			transition-property="box-shadow, background-color, filter, border"
			transitionTimingFunction="linear, linear, linear, linear"
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH="75px"
			justifyContent={{ xl: 'center' }}
			lineHeight="25.6px"
			mx="auto"
			mt={secondaryMargin}
			pb="8px"
			px={{
				sm: paddingX,
				md: '60px',
			}}
			pt="8px"
			top={{ base: '12px', md: '16px', xl: '18px' }}
			w="100%"
			zIndex={100}
		>
			<Flex
				w="100%"
				flexDirection={{
					sm: 'column',
					md: 'row',
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}
			>
				<Box
					mb={{ sm: '8px', md: '0px' }}
					display={{ sm: 'none', md: 'block' }}
				>
					<HStack spacing="8px">
						{/* Here we create navbar brand, based on route name */}
						<Link
							color={mainText}
							href="#"
							bg="inherit"
							borderRadius="inherit"
							fontWeight="bold"
							fontSize="2xl"
							_hover={{ color: { mainText } }}
							_active={{
								bg: 'inherit',
								transform: 'none',
								borderColor: 'transparent',
							}}
							_focus={{
								boxShadow: 'none',
							}}
						>
							{/*router.pathname === '/'
								? brandText
								: // Generate name from path only first path
								  router.pathname
										.split('/')[2]
										.split('-')
										.map((word) => {
											return word.charAt(0).toUpperCase() + word.slice(1);
										})
									.join(' ')*/}
						</Link>
						<PermissionGuard
							requiredPermission="dashboard.view"
							_for="client"
						>
							<CustomCard
								borderRadius={'full'}
								py="10px"
								px="20px"
							>
								<HStack spacing="18px">
									<HStack spacing="8px">
										<Text
											fontSize="sm"
											color={secondaryText}
											fontWeight="bold"
										>
											Active Plan:
										</Text>
										<Badge colorScheme="green">
											{session?.client?.planType?.name}
										</Badge>
									</HStack>
									<HStack spacing="8px">
										<Text
											fontSize="sm"
											color={secondaryText}
											fontWeight="bold"
										>
											Remaining License:
										</Text>
										<Badge colorScheme="gray">
											{moment(session?.client?.license?.validUntil).diff(
												moment(),
												'days'
											) > 0
												? moment(session?.client?.license?.validUntil).diff(
														moment(),
														'days'
												  )
												: 0}
										</Badge>
									</HStack>
								</HStack>
							</CustomCard>
						</PermissionGuard>
					</HStack>
				</Box>
				<Box
					ms="auto"
					w={{ sm: '100%', md: 'unset' }}
					zIndex="2"
				>
					<HeaderLinks secondary={props.secondary} />
				</Box>
			</Flex>
		</Box>
	);
}
