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
	Badge,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiDelete, FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
export default function Domains() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('tibs', () =>
		API.get(ENDPOINTS.tibs)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.tibs}/${id}`);
			toast({
				title: 'Tib deleted',
				description: 'Tib has been deleted',
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
			requiredPermission="tibs.view"
			_for="all"
		>
			<List
				title="Tib Domains"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/tibs/new')}
						leftIcon={<FiPlus />}
					>
						New Tib Check
					</Button>
				)}
				cells={[
					{
						label: 'Domain',
						renderCell: (row: any) => row.domain,
					},
					{
						label: 'Client',
						renderCell: (row: any) => (
							<>
								<PermissionGuard
									requiredPermission="clients.view"
									_for="admin"
								>
									{row.client?.website}
								</PermissionGuard>
								<PermissionGuard
									requiredPermission="clients.view"
									_for="affiliate"
								>
									-
								</PermissionGuard>
							</>
						),
					},
					{
						label: 'Status',
						renderCell: (row: any) => (
							<Badge
								colorScheme={
									row.status === 'active'
										? 'green'
										: row.status === 'blocked'
										? 'red'
										: 'gray'
								}
							>
								{row.status === 'active'
									? 'Active'
									: row.status === 'blocked'
									? 'Blocked'
									: 'Not Reachable'}
							</Badge>
						),
					},
					{
						label: 'Actions',
						renderCell: (row: any) => (
							<HStack>
								<Popover>
									<PopoverTrigger>
										<IconButton
											aria-label="Edit"
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
												Are you sure you want to delete this domain?
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
