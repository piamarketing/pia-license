import MainContainer from '@/components/MainContainer';
import {
	Box,
	Flex,
	HStack,
	Text,
	Divider,
	Checkbox,
	Switch,
	VStack,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	SimpleGrid,
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Heading,
	CardHeader,
	CardFooter,
	useToast,
	TableContainer,
	Table,
	Thead,
	Th,
	Tr,
	Tbody,
	useDisclosure,
	useColorModeValue,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from '@chakra-ui/react';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useQuery } from 'react-query';
import Card from '@/lib/ui/horizon/components/card/Card';

const PERMISSONS: any = [
	{
		name: 'Clients',
		slug: 'clients',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Companies',
		slug: 'companies',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Domains',
		slug: 'domains',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Groups',
		slug: 'groups',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Invoices',
		slug: 'invoices',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'News',
		slug: 'notfications',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Payment Accounts',
		slug: 'paymentAccounts',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Plans',
		slug: 'plans',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Products',
		slug: 'products',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Roles',
		slug: 'roles',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Tickets',
		slug: 'tickets',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
	{
		name: 'Users',
		slug: 'users',
		items: [
			{
				name: 'View',
				slug: 'view',
			},
			{
				name: 'Create',
				slug: 'create',
			},
			{
				name: 'Edit',
				slug: 'edit',
			},
			{
				name: 'Delete',
				slug: 'delete',
			},
		],
	},
];

export default function UsersRoles() {
	// API.get(ENDPOINTS.roles)
	const {
		data: roles,
		isLoading: rolesIsLoading,
		refetch: rolesRefetch,
	} = useQuery('roles', () => API.get(ENDPOINTS.roles));

	const toast = useToast();
	const [name, setName] = useState('');
	const [permissions, setPermissions] = useState([]);
	const [id, setId] = useState('');
	const {
		isOpen: isDeleteModalOpen,
		onOpen: onDeleteModalOpen,
		onClose: onDeleteModalClose,
	} = useDisclosure();

	const handleDeleteRole = async (id: string) => {
		setId(id);
		try {
			await API.delete(`${ENDPOINTS.roles}/${id}`);
			toast({
				title: 'Successful',
				description: 'Role has been deleted.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			setName('');
			setPermissions([]);
			rolesRefetch();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Role could not be deleted.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handlePermissionChange = (group: string, item: string) => {
		const newPermissions = [...permissions];
		const index = newPermissions.indexOf(`${group}.${item}`);
		if (index > -1) {
			newPermissions.splice(index, 1);
		} else {
			newPermissions.push(`${group}.${item}`);
		}
		setPermissions(newPermissions);
	};

	const handleCreateRole = async () => {
		try {
			const response = await API.post(ENDPOINTS.roles, {
				name,
				permissions,
			});

			toast({
				title: 'Başarılı',
				description: 'Rol başarıyla oluşturuldu.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			setName('');
			setPermissions([]);
			rolesRefetch();
		} catch (error) {
			toast({
				title: 'Hata',
				description: 'Rol oluşturulurken bir hata oluştu.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleUpdateRole = async () => {
		try {
			const response = await API.put(`${ENDPOINTS.roles}/${id}`, {
				name,
				permissions,
			});
			toast({
				title: 'Success',
				description: 'Role has been updated.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			rolesRefetch();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Role could not be updated.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<MainContainer
			requiredPermission="roles.view"
			_for="admin"
		>
			<HStack
				w="100%"
				spacing="5"
				align="flex-start"
			>
				<Flex
					flex="7"
					w="100%"
				>
					<Card w="100%">
						<Flex
							mb="8px"
							justifyContent="space-between"
							align="center"
						>
							<Text
								color={useColorModeValue('secondaryGray.900', 'white')}
								fontSize="lg"
								mb="4px"
								fontWeight="700"
								lineHeight="100%"
							>
								Roles
							</Text>
						</Flex>

						<TableContainer>
							<Table>
								<Thead>
									<Tr>
										<Th>Role Name</Th>
										<Th
											colSpan={3}
											isNumeric
										>
											Actions
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{!rolesIsLoading &&
										roles?.data?.data.map((role) => (
											<Tr key={role.id}>
												<Th>{role.name}</Th>
												<Th
													isNumeric
													colSpan={3}
												>
													<HStack justifyContent="flex-end">
														<Button
															size="xs"
															colorScheme="blue"
															onClick={() => {
																setId(role._id);
																setName(role.name);
																setPermissions(role.permissions);
															}}
														>
															Düzenle
														</Button>
														<Popover trigger="click">
															<PopoverTrigger>
																<Button
																	size="xs"
																	colorScheme="red"
																>
																	Sil
																</Button>
															</PopoverTrigger>
															<PopoverContent>
																<PopoverBody flexDirection={'column'}>
																	<VStack>
																		<Text>Are you sure?</Text>
																		<Button
																			size="xs"
																			colorScheme="red"
																			onClick={() => handleDeleteRole(role._id)}
																		>
																			Yes
																		</Button>
																	</VStack>
																</PopoverBody>
															</PopoverContent>
														</Popover>
													</HStack>
												</Th>
											</Tr>
										))}
								</Tbody>
							</Table>
						</TableContainer>
					</Card>
				</Flex>
				<Flex
					flex="10"
					w="100%"
				>
					<Card w="100%">
						<Flex
							mb="8px"
							justifyContent="space-between"
							align="center"
						>
							<Text
								color={useColorModeValue('secondaryGray.900', 'white')}
								fontSize="lg"
								mb="4px"
								fontWeight="700"
								lineHeight="100%"
							>
								Manage Roles
							</Text>
						</Flex>
						<FormControl
							pb="5"
							pt="2"
						>
							<Text
								fontWeight="semibold"
								pb="2"
							>
								Role Name
							</Text>
							<Input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<FormHelperText>Name of the role</FormHelperText>
						</FormControl>
						<Text
							fontWeight="semibold"
							pb="3"
						>
							Permissions
						</Text>
						{PERMISSONS.map((permission) => (
							<Accordion
								allowToggle
								key={permission.slug}
							>
								<AccordionItem>
									<AccordionButton>
										<Box
											flex="1"
											textAlign="left"
										>
											{permission.name}
										</Box>
										<AccordionIcon />
									</AccordionButton>
									<AccordionPanel pb={4}>
										<SimpleGrid
											columns={2}
											spacing={5}
										>
											{permission.items.map((item) => (
												<HStack key={item.slug}>
													<Switch
														name={`${permission.slug}.${item.slug}`}
														onChange={() =>
															handlePermissionChange(permission.slug, item.slug)
														}
														isChecked={
															permissions.indexOf(
																`${permission.slug}.${item.slug}`
															) > -1
														}
													/>
													<Text
														fontSize="sm"
														fontWeight="bold"
														color={
															item.dangerLevel >= 2
																? 'red.500'
																: item.dangerLevel === 1
																? 'orange.500'
																: 'black.500'
														}
													>
														{item.name}
													</Text>
												</HStack>
											))}
										</SimpleGrid>
									</AccordionPanel>
								</AccordionItem>
							</Accordion>
						))}

						<HStack
							w="100%"
							align="center"
							mt="6"
						>
							{id && (
								<Button
									w="100%"
									colorScheme="teal"
									onClick={handleUpdateRole}
								>
									Edit
								</Button>
							)}
							<Button
								w="100%"
								onClick={handleCreateRole}
								colorScheme="blue"
							>
								Create
							</Button>
						</HStack>
					</Card>
				</Flex>
			</HStack>
		</MainContainer>
	);
}
