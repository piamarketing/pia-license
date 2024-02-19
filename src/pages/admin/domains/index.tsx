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
	const { data, isLoading, refetch } = useQuery('domains', () =>
		API.get(ENDPOINTS.domains)
	);

	const [activeId, setActiveId] = useState<number | null>(null);

	return (
		<MainContainer
			requiredPermission="domains.view"
			_for="all"
		>
			<List
				title="Domains"
				data={data?.data?.data}
				isLoading={isLoading}
				rightMenu={(data: any) => (
					<Button
						colorScheme="blue"
						onClick={() => router.push('/admin/domains/new')}
						leftIcon={<FiPlus />}
					>
						New Domain
					</Button>
				)}
				cells={[
					{
						label: 'ID',
						renderCell: (row: any) => row._id,
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
						label: 'Total Domains',
						renderCell: (row: any) => row.domains?.length,
					},
					{
						label: 'Is Active',
						renderCell: (row: any) => (
							<Badge colorScheme={row.isActive ? 'green' : 'red'}>
								{row.isActive ? 'Active' : 'Inactive'}
							</Badge>
						),
					},
				]}
			/>
		</MainContainer>
	);
}
