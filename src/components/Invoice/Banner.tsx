// Chakra imports
import { Badge, Icon, Flex, Button, Text } from '@chakra-ui/react';

// Custom components
import Card from '@/lib/ui/horizon/components/card/Card';
import { VSeparator } from '@/lib/ui/horizon/components/separator/Separator';

// Assets
import { MdShare, MdEdit, MdDownload } from 'react-icons/md';
import InvoiceBg from '@/lib/ui/horizon/assets/img/account/InvoiceBg.png';

export default function Banner(props: {
	invoice: any;
	illustration?: string | JSX.Element;
	focused?: boolean;
	title?: string;
	value?: string;
	detail?: string;
	[x: string]: any;
}) {
	const { invoice, illustration, focused, title, value, detail, ...rest } =
		props;

	// Chakra Color Mode
	const bgButton = 'rgba(255,255,255,0.12)';
	const bgHover = { bg: 'whiteAlpha.50' };
	const bgFocus = { bg: 'rgba(255,255,255,0.12)' };
	console.log(invoice);
	return (
		<Card
			backgroundImage={InvoiceBg.src}
			backgroundRepeat="no-repeat"
			bgSize="cover"
			bgPosition="10%"
			p={{ base: '20px', md: '60px' }}
			pt={{ base: '40px', md: '75px' }}
			pb="140px"
		>
			<Flex
				mb={{ base: '0px', md: '50px' }}
				direction={{ base: 'column', md: 'row' }}
			>
				<Flex
					direction="column"
					color="white"
					h="100%"
					w="100%"
					mb={{ base: '20px', md: '0px' }}
				>
					<Text
						mt={{ base: '10px', md: '0px' }}
						fontSize={{ base: '2xl', md: '32px', lg: '44px', xl: '44px' }}
						fontWeight="bold"
					>
						Invoice #{invoice?._id.slice(0, 5)}
						{invoice?._id.slice(-1, 4)}
					</Text>
					<Text
						fontSize={{ base: 'lg', md: 'xl' }}
						fontWeight="regular"
					>
						{invoice?._id}
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
