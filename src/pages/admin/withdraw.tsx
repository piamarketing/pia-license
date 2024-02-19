import MainContainer from '@/components/MainContainer';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import List from '@/components/List';
import { Badge, Button, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import WithdrawRequestModal from '@/components/Modals/WithdrawRequestModal';
import moment from 'moment';

type WithdrawRequestStatus = 'pending' | 'approved' | 'rejected';

interface WithdrawRequestProps {
	status: WithdrawRequestStatus;
}

export const WithdrawRequestStatus = ({ status }: WithdrawRequestProps) => {
	switch (status) {
		case 'pending':
			return <Badge colorScheme="yellow">Pending</Badge>;
		case 'approved':
			return <Badge colorScheme="green">Approved</Badge>;
		case 'rejected':
			return <Badge colorScheme="red">Rejected</Badge>;
		default:
			return <Badge colorScheme="yellow">Pending</Badge>;
	}
};

export default function Home() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data, isLoading, error } = useQuery('withdraw-requests', () =>
		API.get(ENDPOINTS.withdrawRequests)
	);

	return (
		<>
			<WithdrawRequestModal
				isOpen={isOpen}
				onClose={onClose}
			/>
			<MainContainer
				requiredPermission="affiliate"
				_for="affiliate"
			>
				<List
					title="Withdraw Requests"
					data={data?.data?.data}
					isLoading={isLoading}
					rightMenu={(data: any) => (
						<Button
							colorScheme="blue"
							onClick={() => onOpen()}
							leftIcon={<FiPlus />}
							size="sm"
						>
							Request Withdraw
						</Button>
					)}
					cells={[
						{
							label: '_Id',
							renderCell: (row: any) => row._id,
						},
						{
							label: 'Status',
							renderCell: (row: any) => (
								<WithdrawRequestStatus status={row.status} />
							),
						},
						{
							label: 'Amount',
							renderCell: (row: any) =>
								(row.amount || 0).toLocaleString('tr-TR', {
									style: 'currency',
									currency: 'TRY',
								}),
						},
						{
							label: 'Payment Method',
							renderCell: (row: any) => row.paymentMethod,
						},
						{
							label: 'Created At',
							renderCell: (row: any) =>
								moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
						},
						{
							label: 'Updated At',
							renderCell: (row: any) =>
								moment(row.updatedAt).format('DD/MM/YYYY HH:mm'),
						},
					]}
				/>
			</MainContainer>
		</>
	);
}
