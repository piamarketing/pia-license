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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiDelete, FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
export default function Groups() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, refetch } = useQuery('groups', () =>
		API.get(ENDPOINTS.groups)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		try {
			await API.delete(`${ENDPOINTS.groups}/${id}`);
			toast({
				title: 'Group deleted',
				description: 'Group has been deleted',
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
			requiredPermission="groups.view"
			_for="admin"
		>
			<List
				title="Groups"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/groups/new')}
						leftIcon={<FiPlus />}
					>
						New Group
					</Button>
				)}
				cells={[
					{
						label: 'Name',
						renderCell: (row: any) => row.name,
					},
					{
						label: 'Comission',
						renderCell: (row: any) => row.rate,
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
												Are you sure you want to delete this group?
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
