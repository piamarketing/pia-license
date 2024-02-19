import {
	Box,
	Text,
	Icon,
	Flex,
	Center,
	Image,
	Heading,
	Button,
} from '@chakra-ui/react';
import {
	Sidebar,
	Menu,
	MenuItem,
	SubMenu,
	useProSidebar,
	sidebarClasses,
} from 'react-pro-sidebar';
import Link from 'next/link';
import {
	FiUser,
	FiFileText,
	FiHome,
	FiLayout,
	FiMenu,
	FiSettings,
	FiBook,
	FiUsers,
	FiBarChart2,
	FiCreditCard,
	FiStar,
	FiUserCheck,
	FiRefreshCcw,
	FiGlobe,
	FiPaperclip,
	FiFlag,
	FiBookOpen,
	FiBriefcase,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PermissionGuard } from '../PermissionGuard';

interface SubMenuItem {
	title: string;
	href: string;
	permission: string;
	_for?: 'admin' | 'affiliate' | 'all';
	icon?: React.ReactNode;
}

interface MenuItem {
	title: string;
	icon: React.ReactNode;
	type: 'main_item' | 'sub_item';
	href: string;
	permission: string;
	_for?: 'admin' | 'affiliate' | 'all';
	items?: Array<SubMenuItem>;
}

interface Menu {
	title: string;
	type: 'header' | 'main_item' | 'sub_item';
	items: Array<MenuItem>;
}

export const DesktopSidebar = () => {
	const router = useRouter();
	const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
		useProSidebar();
	const MENU: Array<Menu> = [
		{
			title: '',
			type: 'header',
			items: [
				{
					title: 'Dashboard',
					icon: <Icon as={FiHome} />,
					type: 'sub_item',
					href: '/admin/',
					permission: 'settings.view',
					_for: 'all',
				},
				{
					title: 'Super Admin',
					icon: <Icon as={FiBriefcase} />,
					type: 'main_item',
					href: '/admin/paymentAccounts',
					permission: 'paymentAccounts.view',
					_for: 'admin',
					items: [
						{
							title: 'Clients',
							href: '/admin/clients',
							permission: 'clients.view',
							_for: 'admin',
						},
						{
							title: 'Plans',
							href: '/admin/plans',
							permission: 'plans.view',
							_for: 'admin',
						},
						{
							title: 'Payment Accounts',
							href: '/admin/paymentAccounts',
							permission: 'paymentAccounts.view',
							_for: 'admin',
						},
						{
							title: 'Products',
							href: '/admin/products',
							permission: 'products.view',
							_for: 'admin',
						},
						{
							title: 'News',
							href: '/admin/notifications',
							permission: 'news.view',
							_for: 'admin',
						},
						{
							title: 'Compaines',
							href: '/admin/companies',
							permission: 'companies.view',
							_for: 'admin',
						},
						{
							title: 'Reports',
							href: '/admin/reports',
							permission: 'reports.view',
							_for: 'admin',
						}
					],
				},
				{
					title: 'Payment Notices',
					icon: <Icon as={FiCreditCard} />,
					type: 'sub_item',
					href: '/admin/paymentNotices',
					permission: 'paymentNotices.view',
					_for: 'all',
				},
				{
					title: 'Support Tickets',
					icon: <Icon as={FiFlag} />,
					type: 'sub_item',
					href: '/admin/tickets',
					permission: 'tickets.view',
					_for: 'all',
				},
				{
					title: 'Domain Orders',
					icon: <Icon as={FiGlobe} />,
					type: 'sub_item',
					href: '/admin/domains',
					permission: 'domains.view',
					_for: 'all',
				},
				{
					title: 'Tib Checks',
					icon: <Icon as={FiGlobe} />,
					type: 'sub_item',
					href: '/admin/tibs',
					permission: 'tibs.view',
					_for: 'all',
				},
				{
					title: 'Invoices',
					icon: <Icon as={FiFileText} />,
					type: 'sub_item',
					href: '/admin/invoices',
					permission: 'invoices.view',
					_for: 'all',
				},
				{
					title: 'Users',
					icon: <Icon as={FiUserCheck} />,
					type: 'main_item',
					href: '/admin/users',
					permission: 'users.view',
					_for: 'admin',
					items: [
						{
							title: 'Users List',
							href: '/admin/users',
							permission: 'users.view',
						},
						{
							title: 'User Roles',
							href: '/admin/roles',
							permission: 'roles.view',
						},
					],
				},
			],
		},
	];

	return (
		<Flex
			flex={collapsed ? 0 : 2}
			display={{ base: 'none', md: 'flex' }}
			//padding={{ base: '0', md: '10px 20px' }}
			minH="100vh"
		>
			<Sidebar
				width="100%"
				style={{ marginLeft: '0', background: '#fff', border: 'none' }}
				collapsedWidth="60px"
				rootStyles={{
					[`.${sidebarClasses.container}`]: {
						backgroundColor: 'white',
						//borderRadius: '25px',
						borderRightColor: 'none',
						//boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
					},
				}}
			>
				<Flex
					justify={collapsed ? 'center' : 'flex-end'}
					align="center"
					px={collapsed ? '0' : '4'}
					py="2"
				>
					<Button onClick={() => collapseSidebar()}>
						<Icon as={FiMenu} />
					</Button>
				</Flex>

				{!toggled && collapsed ? (
					<Center py="2">
						<Image
							src="/images/logo_colored_small.png"
							alt="logo"
							w="30px"
							minW="30px"
							h="30px"
							minH="30px"
						/>
					</Center>
				) : (
					<Center py="2">
						<Image
							src="/images/logo_colored.png"
							alt="logo"
							w="170px"
							minW="170px"
							h="30px"
							minH="30px"
						/>
					</Center>
				)}
				<Menu>
					{MENU.map((menu) => (
						<>
							<Box>
								<Heading
									fontSize={['xl', 'xl']}
									fontWeight="semibold"
									py="3"
									display={'block'}
									height="30px"
									paddingLeft="15px"
									marginBottom="10px"
								>
									{!collapsed && menu.title}
								</Heading>
							</Box>
							{menu.items.map((item) => (
								<>
									{item.type === 'main_item' ? (
										<PermissionGuard
											requiredPermission={item.permission}
											_for={item._for}
										>
											<SubMenu
												key={item.title}
												label={<Text fontWeight="semibold">{item.title}</Text>}
												icon={item.icon}
												style={{
													height: '49px',
													paddingLeft: '10px',
													paddingRight: '10px',
												}}
												defaultOpen={router.pathname.includes(item.href)}
											>
												{item.items?.map((subItem) => (
													<MenuItem
														key={subItem.title}
														icon={subItem.icon}
														onClick={() => router.push(subItem.href)}
														active={true}
														// onactive style
													>
														<Text fontWeight="">{subItem.title}</Text>
													</MenuItem>
												))}
											</SubMenu>
										</PermissionGuard>
									) : (
										<PermissionGuard
											requiredPermission={item.permission}
											_for={item._for}
										>
											<MenuItem
												key={item.title}
												icon={item.icon}
												style={{
													height: '49px',
													paddingLeft: '10px',
													paddingRight: '10px',
												}}
												onClick={() => router.push(item.href)}
											>
												<Text
													fontWeight="semibold"
													display={collapsed ? 'none' : 'block'}
												>
													{item.title}
												</Text>
											</MenuItem>
										</PermissionGuard>
									)}
								</>
							))}
						</>
					))}
				</Menu>
			</Sidebar>
		</Flex>
	);
};

const SidebarMenu = () => {
	return <DesktopSidebar />;
};

export default SidebarMenu;
