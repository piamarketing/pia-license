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
	Icon,
	Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
	FiArrowRight,
	FiCreditCard,
	FiDelete,
	FiEdit,
	FiPlus,
	FiTrash,
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import API, { ENDPOINTS } from '@/lib/API';
import { useState } from 'react';
import moment from 'moment';
import { BitcoinLogo } from '@/lib/ui/horizon/components/icons/Icons';
import { FaBitcoin } from 'react-icons/fa';
import Banner from '@/components/Invoice/Banner';
import Content from '@/components/Invoice/Content';
import Card from '@/lib/ui/horizon/components/card/Card';
import invoice from '@/server/services/invoice';

export default function Invoice() {
	const [isCreditCardPaymentWaiting, setIsCreditCardPaymentWaiting] =
		useState(false);
	const router = useRouter();
	const toast = useToast();
	const { id } = router.query;
	const { data, isLoading, refetch } = useQuery(
		'invoice',
		async () => await API.get(`${ENDPOINTS.invoices}/${id}`),
		{
			enabled: !!id,
		}
	);

	const handleCreditCardPayment = async (invoice: any) => {
		// Go to invoice payment page with _blank target
		window.open(invoice?.stripeData?.hosted_invoice_url, '_blank');
	};

	return (
		<MainContainer
			requiredPermission="invoices.view"
			_for="all"
		>
			<Card
				maxW="920px"
				mx="auto"
			>
				<Flex
					direction="column"
					width="stretch"
				>
					<Banner invoice={data?.data?.data} />
					<Content
						invoice={data?.data?.data}
						onClickCreditCardPayment={handleCreditCardPayment}
						isCreditCardPaymentWaiting={isCreditCardPaymentWaiting}
					/>
				</Flex>
			</Card>
		</MainContainer>
	);
}
