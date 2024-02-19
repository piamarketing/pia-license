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
	Tooltip,
	PopoverFooter,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
	FiArrowRightCircle,
	FiDelete,
	FiEdit,
	FiPlus,
	FiTrash,
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import { FaHandHolding } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
export default function Tickets() {
	const { data: session } = useSession();
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('tickets', () =>
		API.get(ENDPOINTS.tickets)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.tickets}/${id}`);
			toast({
				title: 'Ticket deleted',
				description: 'Ticket has been deleted',
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

	const handleTake = async (id: number) => {
		try {
			await API.put(`${ENDPOINTS.tickets}/take/${id}`, {
				admin: session._id,
			});
			toast({
				title: 'Ticket taken',
				description: 'Ticket has been taken',
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
			requiredPermission="tickets.view"
			_for="all"
		>
			<List
				title="Tickets"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/tickets/new')}
						leftIcon={<FiPlus />}
					>
						New Ticket
					</Button>
				)}
				cells={[
					{
						label: 'Ticket ID',
						renderCell: (row: any) => row.ticketId || '-',
					},
					{
						label: 'Client',
						renderCell: (row: any) => (
							<>
								<PermissionGuard
									requiredPermission="clients.view"
									_for="admin"
								>
									<Text>{row.client?.website || '-'}</Text>
								</PermissionGuard>
								<PermissionGuard
									requiredPermission="clients.view"
									_for="client"
								>
									<Text>-</Text>
								</PermissionGuard>
							</>
						),
					},
					{
						label: 'Category',
						renderCell: (row: any) => row.category || '-',
					},
					{
						label: 'Subject',
						renderCell: (row: any) => row.subject,
					},
					{
						label: 'Status',
						renderCell: (row: any) => (
							<Badge
								colorScheme={
									row.status === 'open'
										? 'green'
										: row.status === 'closed'
										? 'red'
										: 'yellow'
								}
							>
								{row.status === 'open'
									? 'Open'
									: row.status === 'closed'
									? 'Closed'
									: 'Pending'}
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
											aria-label="Take ticket"
											icon={<FaHandHolding />}
											size="xs"
											colorScheme="blue"
											isDisabled={row.user}
										/>
									</PopoverTrigger>
									<PopoverContent>
										<PopoverArrow />
										<PopoverCloseButton />
										<PopoverBody
											display="flex"
											alignItems="center"
											flexDirection="column"
										>
											Are you sure you want to take this ticket?
											<Button
												size="sm"
												colorScheme="blue"
												onClick={() => handleTake(row._id)}
												mt={3}
											>
												Yes
											</Button>
										</PopoverBody>
									</PopoverContent>
								</Popover>
								<IconButton
									aria-label="Edit"
									icon={<FiArrowRightCircle />}
									size="xs"
									colorScheme="blue"
									onClick={() => router.push(`/admin/tickets/${row._id}`)}
								/>
							</HStack>
						),
					},
				]}
			/>
		</MainContainer>
	);
}
