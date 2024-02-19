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
export default function Companies() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('companies', () =>
		API.get(ENDPOINTS.companies)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.companies}/${id}`);
			toast({
				title: 'Company deleted',
				description: 'Company has been deleted',
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
			requiredPermission="companies.view"
			_for="admin"
		>
			<List
				title="Companies"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/companies/new')}
						leftIcon={<FiPlus />}
					>
						New Company
					</Button>
				)}
				cells={[
					{
						label: 'Name',
						renderCell: (row: any) => row.name,
					},
					{
						label: 'Type',
						renderCell: (row: any) => (
							<Badge colorScheme="gray">
								{row.type === 'master' ? 'Master' : 'Sub'}
							</Badge>
						),
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
									onClick={() => router.push(`/admin/companies/${row._id}`)}
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
												Are you sure you want to delete this company?
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
