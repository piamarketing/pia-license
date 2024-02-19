import {
	Box,
	Button,
	Flex,
	Input,
	Icon,
	InputGroup,
	FormControl,
	FormLabel,
	Text,
	useDisclosure,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
	VStack,
	Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
const WithdrawRequestModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const toast = useToast();
	const [amount, setAmount] = useState<any>(null);
	const [paymentMethod, setPaymentMethod] = useState<any>(null);
	const [accountNumber, setAccountNumber] = useState<any>(null);

	const handleSubmit = async () => {
		try {
			if (!amount) {
				toast({
					title: 'Please enter amount.',
					description: 'Please enter amount.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			await API.post(`${ENDPOINTS.withdrawRequests}/request-withdraw`, {
				amount,
				paymentMethod,
				accountNumber,
			});
			toast({
				title: 'Withdraw request sent.',
				description: 'Withdraw request sent.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			onClose();
		} catch (error) {
			toast({
				title: 'An error occurred.',
				description: 'An error occurred.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
		>
			<ModalOverlay
				width="100%"
				height="100%"
			/>
			<ModalContent width="100%">
				<ModalHeader>Request Withdraw</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack>
						<FormControl id="paymentMethod">
							<FormLabel>Payment Method</FormLabel>
							<Select
								placeholder="Select payment method"
								onChange={(e) => setPaymentMethod(e.target.value)}
							>
								<option value="bank">Bank</option>
								<option value="paypal">Paypal</option>
								<option value="bitcoin">Bitcoin</option>
							</Select>
						</FormControl>
						<FormControl id="amount">
							<FormLabel>Amount</FormLabel>
							<Input
								type="number"
								placeholder="Amount"
								onChange={(e) => setAmount(e.target.value)}
							/>
						</FormControl>
						<FormControl id="accountNumber">
							<FormLabel>Account Number</FormLabel>
							<Input
								type="text"
								placeholder="Account Number"
								onChange={(e) => setAccountNumber(e.target.value)}
							/>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={handleSubmit}
					>
						Request
					</Button>
					<Button
						variant="ghost"
						onClick={onClose}
					>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WithdrawRequestModal;
