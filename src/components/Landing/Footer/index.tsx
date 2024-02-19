import {
	Box,
	chakra,
	Container,
	Image,
	Stack,
	Text,
	useColorModeValue,
	VisuallyHidden,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ReactNode } from 'react';

const Logo = (props: any) => {
	return (
		<Image
			src={props.logo}
			alt="logo"
			height={'32px'}
		/>
	);
};

const SocialButton = ({
	children,
	label,
	href,
}: {
	children: ReactNode;
	label: string;
	href: string;
}) => {
	return (
		<chakra.button
			bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
			rounded={'full'}
			w={8}
			h={8}
			cursor={'pointer'}
			as={'a'}
			href={href}
			display={'inline-flex'}
			alignItems={'center'}
			justifyContent={'center'}
			transition={'background 0.3s ease'}
			_hover={{
				bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</chakra.button>
	);
};

export default function SmallWithLogoLeft({
	logo,
	name,
}: {
	logo: string;
	name: string;
}) {
	return (
		<Box
			bg={`radial-gradient(58.11% 44.54% at 51.59% -9.61%, rgb(180, 176, 254) 0%, rgb(54, 50, 133) 22.92%, rgb(17, 13, 91) 42.71%, rgb(5, 3, 39) 88.54%);`}
			color={'white'}
		>
			<Container
				as={Stack}
				maxW={'7xl'}
				py={4}
				direction={{ base: 'column', md: 'row' }}
				spacing={4}
				justify={{ base: 'center', md: 'space-between' }}
				align={{ base: 'center', md: 'center' }}
			>
				<Logo logo={logo} />
				<Text>© 2023 {name} All Rights Reserved</Text>
				{/*
				<Stack
					direction={'row'}
					spacing={6}
				>
					<SocialButton
						label={'Twitter'}
						href={'#'}
					>
						<FaTwitter />
					</SocialButton>
					<SocialButton
						label={'YouTube'}
						href={'#'}
					>
						<FaYoutube />
					</SocialButton>
					<SocialButton
						label={'Instagram'}
						href={'#'}
					>
						<FaInstagram />
					</SocialButton>
				</Stack>
				*/}
			</Container>
		</Box>
	);
}
