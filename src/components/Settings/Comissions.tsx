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
	Input,
	Switch,
} from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import { useRef, useState } from 'react';

interface ComissionSettingsProps {
	settings?: any;
	setSettings?: any;
	onSave?: any;
}

export default function ComissionSettings({
	settings,
	setSettings,
	onSave,
}: ComissionSettingsProps) {
	const widgetApi = useRef();

	return (
		<TabPanel>
			<Text
				fontSize="xl"
				fontWeight="bold"
				mb="10px"
				textAlign="left"
			>
				Commissions
			</Text>
			<Text
				fontSize="md"
				textAlign="left"
				color="gray.500"
				mb="10px"
			>
				Adjust your commissions here.
			</Text>
			<Divider mb="20px" />

			<SimpleGrid
				spacing={10}
				columns={2}
				w={{ base: '100%', md: '65%' }}
			>
				<VStack
					mt="20px"
					w="100%"
					alignItems="flex-start"
					justify="flex-start"
				>
					<SimpleGrid
						spacing={10}
						columns={2}
						w={{ base: '100%', md: '100%' }}
					>
						<Text
							fontSize="md"
							textAlign="left"
							fontWeight="bold"
						>
							Profit Fee
						</Text>
						<Switch
							isChecked={settings?.commissions?.profitFee?.enabled}
							onChange={(e) => {
								setSettings({
									...settings,
									commissions: {
										...settings?.commissions,
										profitFee: {
											...settings?.commissions?.profitFee,
											enabled: e.target.checked,
										},
									},
								});
							}}
						/>
					</SimpleGrid>
					<Input
						type="number"
						defaultValue={settings?.commissions?.profitFee?.value}
						onChange={(e) => {
							setSettings({
								...settings,
								commissions: {
									...settings?.commissions,
									profitFee: {
										...settings?.commissions?.profitFee,
										value: e.target.value,
									},
								},
							});
						}}
						placeholder="Enter value"
						w={{ base: '100%', md: '50%' }}
					/>
				</VStack>
				<VStack
					mt="20px"
					w="100%"
					alignItems="flex-start"
					justify="flex-start"
				>
					<SimpleGrid
						spacing={10}
						columns={2}
						w={{ base: '100%', md: '100%' }}
					>
						<Text
							fontSize="md"
							textAlign="left"
							fontWeight="bold"
						>
							Deposit Fee
						</Text>
						<Switch
							isChecked={settings?.commissions?.depositFee?.enabled}
							onChange={(e) => {
								setSettings({
									...settings,
									commissions: {
										...settings?.commissions,
										depositFee: {
											...settings?.commissions?.depositFee,
											enabled: e.target.checked,
										},
									},
								});
							}}
						/>
					</SimpleGrid>
					<Input
						type="number"
						defaultValue={settings?.commissions?.depositFee?.value}
						onChange={(e) => {
							setSettings({
								...settings,
								commissions: {
									...settings?.commissions,
									depositFee: {
										...settings?.commissions?.depositFee,
										value: e.target.value,
									},
								},
							});
						}}
						placeholder="Enter value"
						w={{ base: '100%', md: '50%' }}
					/>
				</VStack>
			</SimpleGrid>

			<SimpleGrid
				spacing={10}
				columns={2}
				w={{ base: '100%', md: '65%' }}
			>
				<VStack
					mt="20px"
					w="100%"
					alignItems="flex-start"
					justify="flex-start"
				>
					<SimpleGrid
						spacing={10}
						columns={2}
						w={{ base: '100%', md: '100%' }}
					>
						<Text
							fontSize="md"
							textAlign="left"
							fontWeight="bold"
						>
							Withdrawal Fee
						</Text>
						<Switch
							isChecked={settings?.commissions?.withdrawalFee?.enabled}
							onChange={(e) => {
								setSettings({
									...settings,
									commissions: {
										...settings?.commissions,
										withdrawalFee: {
											...settings?.commissions?.withdrawalFee,
											enabled: e.target.checked,
										},
									},
								});
							}}
						/>
					</SimpleGrid>
					<Input
						type="number"
						defaultValue={settings?.commissions?.withdrawalFee?.value}
						onChange={(e) => {
							setSettings({
								...settings,
								commissions: {
									...settings?.commissions,
									withdrawalFee: {
										...settings?.commissions?.withdrawalFee,
										value: e.target.value,
									},
								},
							});
						}}
						placeholder="Enter value"
						w={{ base: '100%', md: '50%' }}
					/>
				</VStack>
				<VStack
					mt="20px"
					w="100%"
					alignItems="flex-start"
					justify="flex-start"
				>
					<SimpleGrid
						spacing={10}
						columns={2}
						w={{ base: '100%', md: '100%' }}
					>
						<Text
							fontSize="md"
							textAlign="left"
							fontWeight="bold"
						>
							Sporstbook Fee
						</Text>
						<Switch
							isChecked={settings?.commissions?.sportsbookFee?.enabled}
							onChange={(e) => {
								setSettings({
									...settings,
									commissions: {
										...settings?.commissions,
										sportsbookFee: {
											...settings?.commissions?.sportsbookFee,
											enabled: e.target.checked,
										},
									},
								});
							}}
						/>
					</SimpleGrid>
					<Input
						type="number"
						defaultValue={settings?.commissions?.sportsbookFee?.value}
						onChange={(e) => {
							setSettings({
								...settings,
								commissions: {
									...settings?.commissions,
									sportsbookFee: {
										...settings?.commissions?.sportsbookFee,
										value: e.target.value,
									},
								},
							});
						}}
						placeholder="Enter value"
						w={{ base: '100%', md: '50%' }}
					/>
				</VStack>
			</SimpleGrid>

			<SimpleGrid
				spacing={10}
				columns={2}
				w={{ base: '100%', md: '65%' }}
			>
				<VStack
					mt="20px"
					w="100%"
					alignItems="flex-start"
					justify="flex-start"
				>
					<SimpleGrid
						spacing={10}
						columns={2}
						w={{ base: '100%', md: '100%' }}
					>
						<Text
							fontSize="md"
							textAlign="left"
							fontWeight="bold"
						>
							Casino Fee
						</Text>
						<Switch
							isChecked={settings?.commissions?.casinoFee?.enabled}
							onChange={(e) => {
								setSettings({
									...settings,
									commissions: {
										...settings?.commissions,
										casinoFee: {
											...settings?.commissions?.casinoFee,
											enabled: e.target.checked,
										},
									},
								});
							}}
						/>
					</SimpleGrid>
					<Input
						type="number"
						defaultValue={settings?.commissions?.casinoFee?.value}
						onChange={(e) => {
							setSettings({
								...settings,
								commissions: {
									...settings?.commissions,
									casinoFee: {
										...settings?.commissions?.casinoFee,
										value: e.target.value,
									},
								},
							});
						}}
						placeholder="Enter value"
						w={{ base: '100%', md: '50%' }}
					/>
				</VStack>
			</SimpleGrid>

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
