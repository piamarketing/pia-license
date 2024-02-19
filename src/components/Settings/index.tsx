// Chakra imports
import {
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Icon,
} from '@chakra-ui/react';

import Card from '@/lib/ui/horizon/components/card/Card';
import { FiSettings } from 'react-icons/fi';
import { FaPaintBrush, FaPercentage } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import ThemeSettings from './Theme';
import ComissionSettings from './Comissions';
interface SettingsProps {
	settings?: any;
	onSave?: (settings: any) => void;
}

export default function Settings({ settings, onSave }: SettingsProps) {
	const [settingsData, setSettingsData] = useState(settings);

	useEffect(() => {
		setSettingsData(settings);
	}, [settings]);

	return (
		<Card
			p="0px"
			py="0"
			alignItems="center"
			flexDirection="column"
			w="100%"
			textAlign="center"
			bg={'gray.200'}
		>
			<Tabs
				variant="unstyled"
				isFitted
				w="100%"
				display={{ base: 'block', md: 'flex' }}
				minH="600px"
			>
				<TabList
					flexDirection={{ base: 'row', md: 'column' }}
					flex="2"
					borderRight="1px solid"
					borderColor="gray.200"
					px="10px"
					py="10px"
					height="100%"
				>
					<Tab
						py="4"
						borderRadius="30px"
						_selected={{
							color: 'blue.500',
							bg: 'gray.100',
							boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
						}}
						transition="all 0.2s"
					>
						<Icon
							as={FaPaintBrush}
							mr="10px"
						/>
						<Text
							fontSize="sm"
							fontWeight="bold"
						>
							Theme
						</Text>
					</Tab>
					<Tab
						py="4"
						borderRadius="30px"
						_selected={{
							color: 'blue.500',
							bg: 'gray.100',
							boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
						}}
						transition="all 0.2s"
					>
						<Icon
							as={FaPercentage}
							mr="10px"
						/>
						<Text
							fontSize="sm"
							fontWeight="bold"
						>
							Comissions
						</Text>
					</Tab>
				</TabList>
				<TabPanels
					flex="10"
					borderRadius="20px"
					bg="white"
					boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
					pl="20px"
				>
					<ThemeSettings
						settings={settingsData}
						setSettings={setSettingsData}
						// @ts-ignore
						onSave={() => onSave(settingsData)}
					/>
					<ComissionSettings
						settings={settingsData}
						setSettings={setSettingsData}
						// @ts-ignore
						onSave={() => onSave(settingsData)}
					/>
				</TabPanels>
			</Tabs>
		</Card>
	);
}
