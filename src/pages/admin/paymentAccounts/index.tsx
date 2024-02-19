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
export default function PaymentAccounts() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('paymentAccounts', () =>
		API.get(ENDPOINTS.paymentAccounts)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.paymentAccounts}/${id}`);
			toast({
				title: 'PaymentAccount deleted',
				description: 'PaymentAccount has been deleted',
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
			requiredPermission="paymentAccounts.view"
			_for="admin"
		>
			<List
				title="Payment Accounts"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/paymentAccounts/new')}
						leftIcon={<FiPlus />}
					>
						New Payment Account
					</Button>
				)}
				cells={[
					{
						label: 'Payment Method',
						renderCell: (row: any) => row.type,
					},
					{
						label: 'IBAN',
						renderCell: (row: any) => row.iban,
					},
					{
						label: 'Actions',
						renderCell: (row: any) => (
							<HStack>
								<Tooltip label="Edit">
									<IconButton
										aria-label="Edit"
										icon={<FiEdit />}
										size="xs"
										colorScheme="blue"
										onClick={() =>
											router.push(`/admin/paymentAccounts/${row._id}`)
										}
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
												Are you sure you want to delete this payment account?
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
