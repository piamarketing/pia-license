// Chakra imports
import {
	Avatar,
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MessageBlock from '@/lib/ui/horizon/components/chat/MessageBlock';
import React from 'react';
import Linkify from 'linkify-react';
// Assets
import {
	messagesRenderThumb,
	messagesRenderTrack,
	messagesRenderView,
} from '@/lib/ui/horizon/components/scrollbar/Scrollbar';
import { FaCircle, FaExternalLinkAlt, FaLink } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { IoPaperPlane } from 'react-icons/io5';
import {
	MdTagFaces,
	MdOutlineCardTravel,
	MdOutlineLightbulb,
	MdOutlineMoreVert,
	MdOutlinePerson,
	MdOutlineSettings,
	MdOutlineImage,
	MdAttachFile,
	MdAdd,
	MdClose,
} from 'react-icons/md';
import avatar2 from 'assets/img/avatars/avatar2.png';
import moment from 'moment';
import { useSession } from 'next-auth/react';

export default function Messages(props: {
	userNameSurname: string;
	subject: string;
	status: string;
	name: string;
	message: string;
	messages: any[];
	isDisabled: boolean;
	onSendMessage: () => void;
	onChangeMessage: (message: string) => void;
	handleUpdate: (status: string) => void;
	[x: string]: any;
}) {
	const { data: session } = useSession();
	const toast = useToast();
	const {
		userNameSurname,
		subject,
		status,
		name,
		message,
		messages,
		isDisabled,
		onSendMessage,
		onChangeMessage,
		handleUpdate,
		...rest
	} = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');

	const inputColor = useColorModeValue(
		'secondaryGray.700',
		'secondaryGray.700'
	);
	const inputText = useColorModeValue('gray.700', 'gray.100');
	const blockBg = useColorModeValue('secondaryGray.300', 'navy.700');
	const brandButton = useColorModeValue('brand.500', 'brand.400');
	const bgInput = useColorModeValue(
		'linear-gradient(1.02deg, #FFFFFF 49.52%, rgba(255, 255, 255, 0) 99.07%)',
		'linear-gradient(1.02deg, #111C44 49.52%, rgba(17, 28, 68, 0) 99.07%)'
	);
	// Ellipsis modals
	const {
		isOpen: isOpen1,
		onOpen: onOpen1,
		onClose: onClose1,
	} = useDisclosure();

	// Chakra Color Mode
	const textHover = useColorModeValue(
		{ color: 'secondaryGray.900', bg: 'unset' },
		{ color: 'secondaryGray.500', bg: 'unset' }
	);
	const bgList = useColorModeValue('white', 'whiteAlpha.100');
	const brandColor = useColorModeValue('brand.500', 'white');
	const bgShadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
		'unset'
	);
	const borderColor = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');

	const renderLink = ({ attributes, content }: any) => {
		const { href, ...props } = attributes;
		return (
			<Link
				href={href}
				isExternal
				{...props}
				textDecoration="underline"
			>
				{content}{' '}
				<Icon
					as={FaExternalLinkAlt}
					boxSize={'10px'}
				/>
			</Link>
		);
	};

	const renderMessageContent = (text: any) => {
		return (
			<Linkify
				options={{
					render: renderLink,
				}}
			>
				{text}
			</Linkify>
		);
	};

	const renderMessage = (message: any) => {
		return (
			<Flex overflow="hidden">
				<Flex
					direction="column"
					w="100%"
					maxW={{ base: '90%', lg: 'calc(100% - 80px)' }}
					boxSizing="border-box"
					align={
						message.from === 'client' && session?.client
							? 'flex-end'
							: message.from === 'admin' && !session?.client
							? 'flex-end'
							: 'flex-start'
					}
				>
					<MessageBlock
						content={<span>{renderMessageContent(message.message)}</span>}
						time={moment(message.createdAt).format('LT')}
						side={
							message.from === 'client' && session?.client
								? 'right'
								: message.from === 'admin' && !session?.client
								? 'right'
								: 'left'
						}
					/>
				</Flex>
			</Flex>
		);
	};

	const handleCloseTicket = () => {
		try {
			handleUpdate('closed');
			toast({
				title: 'Ticket closed',
				description: 'Ticket has been closed',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		}
	};

	return (
		<Box
			h="100%"
			{...rest}
		>
			<Flex
				px="34px"
				pb="25px"
				borderBottom="1px solid"
				borderColor={borderColor}
				align="center"
			>
				<Box>
					<Text
						color={textColor}
						fontSize={{ base: 'md', md: 'xl' }}
						fontWeight="700"
					>
						{subject}
					</Text>
					<Flex align="center">
						<Icon
							w="6px"
							h="6px"
							me="8px"
							as={FaCircle}
							color={
								status === 'open'
									? 'green.500'
									: status === 'pending-reply'
									? 'orange.500'
									: 'red.500'
							}
						/>
						<Text fontSize={{ base: 'sm', md: 'md' }}>
							{status === 'open'
								? 'Open'
								: status === 'pending-reply'
								? 'Pending Reply'
								: 'Closed'}{' '}
						</Text>

						<Text
							borderLeft="1px solid #E2E8F0"
							fontSize={{ base: 'sm', md: 'md' }}
							pl="3"
							ml="3"
							fontWeight="700"
						>
							Agent: {userNameSurname || 'Not assigned yet'}
						</Text>
					</Flex>
				</Box>
				<Flex
					align="center"
					ms="auto"
				/>
				<Menu
					isOpen={isOpen1}
					onClose={onClose1}
				>
					<MenuButton
						onClick={onOpen1}
						mb="0px"
						me="8px"
					>
						<Icon
							mb="-6px"
							cursor="pointer"
							as={MdOutlineMoreVert}
							color={textColor}
							maxW="min-content"
							maxH="min-content"
							w="24px"
							h="24px"
						/>
					</MenuButton>
					<MenuList
						w="150px"
						minW="unset"
						maxW="150px !important"
						border="transparent"
						backdropFilter="blur(63px)"
						bg={bgList}
						boxShadow={bgShadow}
						borderRadius="20px"
						p="15px"
					>
						<MenuItem
							transition="0.2s linear"
							color={textColor}
							_hover={textHover}
							p="0px"
							borderRadius="8px"
							_active={{
								bg: 'transparent',
							}}
							_focus={{
								bg: 'transparent',
							}}
							mb="10px"
							onClick={handleCloseTicket}
						>
							<Flex align="center">
								<Icon
									as={MdClose}
									h="16px"
									w="16px"
									me="8px"
								/>
								<Text
									fontSize="sm"
									fontWeight="400"
								>
									Close Ticket
								</Text>
							</Flex>
						</MenuItem>
					</MenuList>{' '}
				</Menu>
			</Flex>
			<Box
				h="calc(100% - 80px)"
				px={{ base: '10px', md: '20px' }}
				pt="45px"
				position="relative"
			>
				<Scrollbars
					autoHide
					renderTrackVertical={messagesRenderTrack}
					renderThumbVertical={messagesRenderThumb}
					renderView={messagesRenderView}
				>
					{messages?.map((message) => renderMessage(message))}
					<Box my="150px" />
				</Scrollbars>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSendMessage();
					}}
				>
					<Flex
						bg={bgInput}
						backdropFilter="blur(20px)"
						pt="10px"
						position="absolute"
						w={{ base: 'calc(100% - 20px)', md: 'calc(100% - 40px)' }}
						bottom="0px"
					>
						<InputGroup
							me="10px"
							w={{ base: '100%' }}
						>
							{/*<InputRightElement
							display={{ base: 'none', lg: 'flex' }}
							children={
								<Flex me="70px">
									<IconButton
										aria-label="iconbutton"
										h="max-content"
										w="max-content"
										mt="28px"
										bg="inherit"
										borderRadius="inherit"
										_hover={{ bg: 'none' }}
										_active={{
											bg: 'inherit',
											transform: 'none',
											borderColor: 'transparent',
										}}
										_focus={{
											boxShadow: 'none',
										}}
										icon={
											<Icon
												as={MdAttachFile}
												color={inputColor}
												w="30px"
												h="30px"
											/>
										}
									/>
									<IconButton
										aria-label="iconbutton"
										h="max-content"
										w="max-content"
										mt="28px"
										bg="inherit"
										borderRadius="inherit"
										_hover={{ bg: 'none' }}
										_active={{
											bg: 'inherit',
											transform: 'none',
											borderColor: 'transparent',
										}}
										_focus={{
											boxShadow: 'none',
										}}
										icon={
											<Icon
												as={MdOutlineImage}
												color={inputColor}
												w="30px"
												h="30px"
											/>
										}
									/>
								</Flex>
							}
						/>
                        */}
							<Input
								variant="search"
								fontSize="md"
								pl={{ base: '40px !important', lg: '65px !important' }}
								pr={{
									base: '0px',
									lg: '145px !important',
								}}
								h={{ base: '50px', lg: '70px' }}
								bg={blockBg}
								color={inputText}
								fontWeight="500"
								_placeholder={{ color: 'gray.400', fontSize: '16px' }}
								borderRadius={'50px'}
								placeholder={
									status != 'closed'
										? 'Write your message...'
										: 'Ticket is closed'
								}
								isDisabled={status === 'closed' || isDisabled}
								value={message}
								onChange={(e) => onChangeMessage(e.target.value)}
							/>
						</InputGroup>
						<Button
							borderRadius="50%"
							ms={{ base: '14px', lg: 'auto' }}
							bg={brandButton}
							w={{ base: '50px', lg: '70px' }}
							h={{ base: '50px', lg: '70px' }}
							minW={{ base: '50px', lg: '70px' }}
							minH={{ base: '50px', lg: '70px' }}
							variant="no-hover"
							type="submit"
						>
							<Icon
								as={IoPaperPlane}
								color="white"
								w={{ base: '18px', lg: '25px' }}
								h={{ base: '18px', lg: '25px' }}
							/>
						</Button>
					</Flex>
				</form>
			</Box>
		</Box>
	);
}
