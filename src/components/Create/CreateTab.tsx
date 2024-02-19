import React, { useState } from 'react';
import {
	Button,
	Flex,
	SimpleGrid,
	TabPanel,
	Text,
	useColorModeValue,
	FormControl,
	FormLabel,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Select,
	Textarea,
	Switch,
} from '@chakra-ui/react';
import Card from '@/lib/ui/horizon/components/card/Card';
import InputField from '@/lib/ui/horizon/components/fields/InputField';
import TextField from '@/lib/ui/horizon/components/fields/TextField';
import { MultiSelect } from 'chakra-multiselect';
import { PermissionGuard } from '../PermissionGuard';

export interface Form {
	type:
		| 'text'
		| 'number'
		| 'select'
		| 'boolean'
		| 'textarea'
		| 'multiselect'
		| 'custom';
	label: string;
	placeholder?: string;
	name: string;
	value?: string | number | boolean | Array<string>;
	required?: boolean;
	options?: Array<{ value: string; label: string }>;
	onChangeValue?: (e: any) => void;
	// render with state
	render?: (pState: any, setPState: any) => JSX.Element;
	_for?: 'client' | 'admin' | 'all';
}

export interface CreateTabProps {
	title: string;
	formTemplate: Array<Array<Form>>;
	onClickNext?: () => void;
	onClickBack?: () => void;
	onFinish?: () => void;
}

const CreateTab = ({
	title,
	formTemplate,
	onClickNext,
	onClickBack,
	onFinish,
}: CreateTabProps) => {
	const [form, setForm] = useState(formTemplate);
	// customs states for every custom field
	const [pState, setPState] = useState<any>([]);

	return (
		<TabPanel
			w={{ sm: '330px', md: '700px', lg: '850px' }}
			p="0px"
			mx="auto"
		>
			<Card p="30px">
				<Text
					color={useColorModeValue('secondaryGray.900', 'white')}
					fontSize="2xl"
					fontWeight="700"
					mb="20px"
				>
					{title}
				</Text>
				{form.map((row, i) => (
					<SimpleGrid
						key={i}
						columns={{ sm: 1, md: row.length }}
						spacing="10px"
						mb="20px"
					>
						{row.map((field, j) => {
							switch (field.type) {
								case 'text':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												id="name"
											>
												<FormLabel>{field.label}</FormLabel>
												<InputField
													type="text"
													placeholder={field.placeholder}
													defaultValue={field.value as string}
													onChange={field.onChangeValue}
												/>
											</FormControl>
										</PermissionGuard>
									);
								case 'number':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												id="name"
											>
												<FormLabel>{field.label}</FormLabel>
												<NumberInput
													placeholder={field.placeholder}
													defaultValue={field.value as string}
													onChange={field.onChangeValue}
												>
													<NumberInputField />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											</FormControl>
										</PermissionGuard>
									);
								case 'select':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												id="select"
											>
												<FormLabel>{field.label}</FormLabel>
												<Select
													placeholder="Select option"
													onChange={field.onChangeValue}
													defaultValue={field.value}
												>
													{field.options?.map((option, k) => (
														<option
															key={k}
															value={option.value}
														>
															{option.label}
														</option>
													))}
												</Select>
											</FormControl>
										</PermissionGuard>
									);
								case 'boolean':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												alignItems="center"
											>
												<FormLabel mb="0">{field.label}</FormLabel>
												<Switch
													mt="10px"
													ml="auto"
													defaultChecked={field.value as boolean}
													onChange={field.onChangeValue}
												/>
											</FormControl>
										</PermissionGuard>
									);
								case 'textarea':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												id="name"
											>
												<FormLabel>{field.label}</FormLabel>
												<TextField
													placeholder={field.placeholder}
													name={field.name}
													defaultValue={field.value}
													required={field.required}
													onChange={field.onChangeValue}
												/>
											</FormControl>
										</PermissionGuard>
									);
								case 'multiselect':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<MultiSelect
												key={j}
												options={field.options}
												onChange={field.onChangeValue as any}
											/>
										</PermissionGuard>
									);
								case 'custom':
									return (
										<PermissionGuard
											_for={field._for || 'all'}
											requiredPermission="superadmin"
										>
											<FormControl
												key={j}
												id="name"
											>
												<FormLabel>{field.label}</FormLabel>
												{field.render && field.render(pState, setPState)}
											</FormControl>
										</PermissionGuard>
									);
								default:
									return null;
							}
						})}
					</SimpleGrid>
				))}
				<Flex justify="space-between">
					{onFinish ? (
						<Button
							variant="solid"
							colorScheme="blue"
							onClick={onFinish}
						>
							Finish
						</Button>
					) : (
						<>
							{onClickBack && (
								<Button
									variant="outline"
									colorScheme="blue"
									onClick={onClickBack}
								>
									Previous
								</Button>
							)}
							{onClickNext && (
								<Button
									variant="solid"
									colorScheme="blue"
									onClick={onClickNext}
								>
									Next
								</Button>
							)}
						</>
					)}
				</Flex>
			</Card>
		</TabPanel>
	);
};

export default CreateTab;
