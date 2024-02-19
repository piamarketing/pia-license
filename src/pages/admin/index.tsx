import MainContainer from '@/components/MainContainer';
import MainDashboard from '@/components/Dashboard';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Box, Flex, Grid } from '@chakra-ui/react';
import Earn from '@/components/Referrals/Earn';
import Invite from '@/components/Referrals/Invite';
import ClientDashboard from '@/components/ClientDashboard';

export default function Home() {
	const { data, isLoading } = useQuery('dashboard', () =>
		API.get(`${ENDPOINTS.reports}/dashboard`)
	);

	return (
		<MainContainer
			requiredPermission="dashboard.view"
			_for="all"
		>
			<PermissionGuard
				requiredPermission="dashboard.view"
				_for="admin"
			>
				{!isLoading && (
					<MainDashboard
						data={data?.data?.data}
						isLoading={isLoading}
					/>
				)}
			</PermissionGuard>
			<PermissionGuard
				requiredPermission="dashboard.view"
				_for="client"
			>
				{!isLoading && (
					<ClientDashboard
						data={data?.data?.data}
						isLoading={isLoading}
					/>
				)}
			</PermissionGuard>
		</MainContainer>
	);
}
