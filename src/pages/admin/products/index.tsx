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
	Circle,
	Icon,
	Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
	FiAlertTriangle,
	FiDelete,
	FiEdit,
	FiPlus,
	FiTrash,
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
export default function Products() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('products', () =>
		API.get(ENDPOINTS.products)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.products}/${id}`);
			toast({
				title: 'Product deleted',
				description: 'Product has been deleted',
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
			requiredPermission="products.view"
			_for="admin"
		>
			<List
				title="Products"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/products/new')}
						leftIcon={<FiPlus />}
					>
						New Product
					</Button>
				)}
				cells={[
					{
						label: 'Name',
						renderCell: (row: any) => row.name,
					},
					{
						label: 'Service',
						renderCell: (row: any) =>
							row.service ? (
								<Badge>{row.service}</Badge>
							) : (
								<Tooltip
									label="No service associated, this product has no effect for clients"
									placement="top"
								>
									<Circle
										size="20px"
										bg="red.500"
									>
										<Icon
											as={FiAlertTriangle}
											color="white"
											boxSize="10px"
										/>
									</Circle>
								</Tooltip>
							),
					},
					{
						label: 'Type',
						renderCell: (row: any) =>
							(row.type === 'one_time' && 'One Time') ||
							(row.type === 'recurring' && 'Recurring'),
					},
					{
						label: 'Duration',
						renderCell: (row: any) => `${row.duration} days`,
					},
					{
						label: 'Actions',
						renderCell: (row: any) => (
							<HStack>
								<IconButton
									aria-label="Edit"
									icon={<FiEdit />}
									size="xs"
									colorScheme="blue"
									onClick={() => router.push(`/admin/products/${row._id}`)}
								/>
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
												Are you sure you want to delete this product?
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
