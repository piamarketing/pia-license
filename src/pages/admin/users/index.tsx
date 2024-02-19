import List from '@/components/List';
import MainContainer from '@/components/MainContainer';
import {
	Button,
	HStack,
	IconButton,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text,
	PopoverBody,
	useToast,
	PopoverCloseButton,
	PopoverArrow,
	Switch,
	Tooltip,
	VStack,
	Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiCalendar, FiEdit, FiEye, FiPlus, FiTrash } from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
import moment from 'moment';
export default function Users() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('users', () =>
		API.get(ENDPOINTS.users)
	);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.users}/${id}`);
			toast({
				title: 'User deleted',
				description: 'User has been deleted',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			refetch();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error?.message || 'Something went wrong',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<MainContainer
			requiredPermission="users.view"
			_for="admin"
		>
			<List
				title="Users"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/users/new')}
						leftIcon={<FiPlus />}
						size="sm"
					>
						New User
					</Button>
				)}
				cells={[
					{
						label: 'Name Surname',
						renderCell: (row: any) => row.nameSurname,
					},
					{
						label: 'Email',
						renderCell: (row: any) => row.email,
					},

					{
						isNumeric: true,
						label: 'Role',
						renderCell: (row: any) => (
							<Text fontWeight="semibold">{row.role?.name}</Text>
						),
					},
					{
						label: 'Created At',
						renderCell: (row: any) =>
							moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
					},
					{
						label: 'Enabled',
						renderCell: (row: any) => (
							<Switch
								defaultChecked={row.isEnabled}
								size="xs"
							/>
						),
					},
					{
						label: 'Actions',
						renderCell: (row: any) => (
							<HStack>
								<Tooltip
									label="Edit"
									placement="start-end"
								>
									<IconButton
										aria-label="Edit"
										icon={<FiEdit />}
										size="xs"
										colorScheme="blue"
										onClick={() => {}}
									/>
								</Tooltip>

								<Popover>
									<PopoverTrigger>
										<IconButton
											aria-label="Delete"
											icon={<FiTrash />}
											size="xs"
											colorScheme="red"
										/>
									</PopoverTrigger>
									<PopoverContent>
										<PopoverArrow />
										<PopoverCloseButton />
										<PopoverBody>
											<Text py="4">
												Are you sure you want to delete this user?
											</Text>
											<Button
												colorScheme="red"
												onClick={() => handleDelete(row._id)}
												size="sm"
											>
												Delete
											</Button>
										</PopoverBody>
									</PopoverContent>
								</Popover>
							</HStack>
						),
					},
				]}
			/>
		</MainContainer>
	);
}
