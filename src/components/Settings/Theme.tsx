import {
	TabPanel,
	Text,
	HStack,
	FormControl,
	FormLabel,
	SimpleGrid,
	Divider,
	VStack,
	Textarea,
	Button,
	Flex,
} from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

interface ThemeSettingsProps {
	settings?: any;
	setSettings?: any;
	onSave?: any;
}

export default function ThemeSettings({
	settings,
	setSettings,
	onSave,
}: ThemeSettingsProps) {
	const widgetApi = useRef();
	const [primaryColor, setPrimaryColor] = useState(
		settings?.theme?.primaryColor
	);
	const [secondaryColor, setSecondaryColor] = useState(
		settings?.theme?.secondaryColor
	);

	const handlePrimaryColorChange = (color: any, event: any) => {
		console.log(color);
		setPrimaryColor(color.hex);
	};

	return (
		<TabPanel>
			<Text
				fontSize="xl"
				fontWeight="bold"
				mb="10px"
				textAlign="left"
			>
				Theme
			</Text>
			<Text
				fontSize="md"
				textAlign="left"
				color="gray.500"
				mb="10px"
			>
				You can change your logo, favicon and custom css here.
			</Text>
			<Divider mb="20px" />
			<SimpleGrid
				spacing={10}
				columns={2}
				w={{ base: '100%', md: '30%' }}
				mb="20px"
			>
				<Text
					fontSize="md"
					textAlign="left"
					fontWeight="bold"
				>
					Logo
				</Text>
				<Widget
					publicKey="558b23ad07bf127bae7f"
					ref={widgetApi as any}
					onChange={(info) => {
						setSettings({
							...settings,
							theme: {
								...settings?.theme,
								logo: info?.originalUrl || '',
							},
						});
					}}
					locale="tr"
				/>
			</SimpleGrid>
			<SimpleGrid
				spacing={10}
				columns={2}
				w={{ base: '100%', md: '30%' }}
			>
				<Text
					fontSize="md"
					textAlign="left"
					fontWeight="bold"
				>
					Favicon
				</Text>
				<Widget
					publicKey="558b23ad07bf127bae7f"
					ref={widgetApi as any}
					onChange={(info) => {
						setSettings({
							...settings,
							theme: {
								...settings?.theme,
								favicon: info?.originalUrl || '',
							},
						});
					}}
					locale="tr"
				/>
			</SimpleGrid>
			<HStack
				mt="20px"
				justify="flex-start"
				w="100%"
			>
				<SimpleGrid
					columns={2}
					mt="20px"
				>
					<FormControl id="colorScheme">
						<FormLabel>Primary Color</FormLabel>
						<HStack>
							<SketchPicker
								color={primaryColor}
								onChange={(color) => setPrimaryColor(color.hex)}
							/>
						</HStack>
					</FormControl>
				</SimpleGrid>
			</HStack>

			<Flex
				w="100%"
				justifyContent="flex-start"
			>
				<Button
					mt="20px"
					colorScheme="blue"
					px="100px"
					onClick={() => onSave()}
				>
					Save
				</Button>
			</Flex>
		</TabPanel>
	);
}
