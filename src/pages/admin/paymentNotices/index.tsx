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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
	FiArrowRightCircle,
	FiCheck,
	FiDelete,
	FiEdit,
	FiEye,
	FiPlus,
	FiTrash,
	FiX,
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
export default function PaymentNotices() {
	
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('paymentNotices', () =>
		API.get(ENDPOINTS.paymentNotices)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.paymentNotices}/${id}`);
			toast({
				title: 'PaymentNotice deleted',
				description: 'PaymentNotice has been deleted',
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

	const handleStatusChange = async (id: number, status: string) => {
		try {
			await API.put(`${ENDPOINTS.paymentNotices}/${id}`, {
				status,
			});

			toast({
				title: 'PaymentNotice status changed',
				description: 'PaymentNotice status has been changed',
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
			requiredPermission="paymentNotices.view"
			_for="all"
		>
			
			<List
				title="PaymentNotices"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/paymentNotices/new')}
						leftIcon={<FiPlus />}
					>
						New Payment Notice
					</Button>
				)}
				cells={[
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
						label: 'Invoice',
						renderCell: (row: any) => (
							<Text fontWeight="bold">
								#{row.invoice?._id.slice(0, 8)}{' '}
								{(row.invoice?.totalAmount || 0).toLocaleString('en-US', {
									style: 'currency',
									currency: 'EUR',
								})}
							</Text>
						),
					},
					{
						label: 'Status',
						renderCell: (row: any) => (
							<Badge
								colorScheme={
									row.status === 'approved'
										? 'green'
										: row.status === 'rejected'
										? 'red'
										: 'yellow'
								}
							>
								{row.status === 'approved'
									? 'Approved'
									: row.status === 'rejected'
									? 'Rejected'
									: 'Pending'}
							</Badge>
						),
					},
					{
						label: 'Actions',
						renderCell: (row: any) => (
							<PermissionGuard
								requiredPermission="paymentNotices.approve"
								_for="admin"
							>
								<HStack>
									<Tooltip label="See Payment Notice Document">
										<IconButton
											aria-label="See Payment Notice Document"
											icon={<FiEye />}
											size="xs"
											colorScheme="purple"
											onClick={() => {
												window.open(row.paymentProof, '_blank');
											}}
										/>
									</Tooltip>

									<Popover>
										<PopoverTrigger>
											<IconButton
												aria-label="Delete"
												icon={<FiX />}
												size="xs"
												colorScheme="red"
												isDisabled={row.status !== 'pending'}
											/>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverArrow />
											<PopoverCloseButton />
											<PopoverBody>
												<Text py="4">
													Are you sure you want to reject this payment notice?
												</Text>
												<Button
													colorScheme="red"
													onClick={() =>
														handleStatusChange(row._id, 'rejected')
													}
													size="sm"
												>
													Reject
												</Button>
											</PopoverBody>
										</PopoverContent>
									</Popover>
									<Popover>
										<PopoverTrigger>
											<IconButton
												aria-label="Approve"
												icon={<FiCheck />}
												size="xs"
												colorScheme="green"
												isDisabled={row.status !== 'pending'}
											/>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverArrow />
											<PopoverCloseButton />
											<PopoverBody>
												<Text py="4">
													Are you sure you want to approve this payment notice?
												</Text>
												<Button
													colorScheme="green"
													onClick={() =>
														handleStatusChange(row._id, 'approved')
													}
													size="sm"
												>
													Approve
												</Button>
											</PopoverBody>
										</PopoverContent>
									</Popover>
									<Popover>
										<PopoverTrigger>
											<IconButton
												aria-label="Delete"
												icon={<FiTrash />}
												size="xs"
												colorScheme="red"
												isDisabled={row.status !== 'pending'}
											/>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverArrow />
											<PopoverCloseButton />
											<PopoverBody>
												<Text py="4">
													Are you sure you want to delete this payment notice?
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
							</PermissionGuard>
						),
					},
				]}
			/>
		</MainContainer>
	);
}
