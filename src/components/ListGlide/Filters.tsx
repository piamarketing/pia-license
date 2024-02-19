import {
	Flex,
	Box,
	Table,
	Checkbox,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	FormControl,
	FormLabel,
	Input,
	Select,
	Button,
	Switch,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	SimpleGrid,
	HStack,
} from '@chakra-ui/react';
import Card from '@/lib/ui/horizon/components/card/Card';

export type Filter = {
	name: string;
	value: string;
	type: 'text' | 'number' | 'select' | 'boolean';
	options?: Array<{ value: string; label: string }>;
	onChange: (e: any) => void;
};

export interface FilterProps {
	filters: Array<Filter>;
}

const Filters = ({ filters }: FilterProps) => {
	return (
		<Card
			flexDirection="column"
			w="100%"
			px="0px"
			overflowX={{ sm: 'scroll', lg: 'hidden' }}
		>
			<Flex
				px="25px"
				mb="8px"
				justifyContent="space-between"
				align="center"
			>
				<Text
					color={useColorModeValue('secondaryGray.900', 'white')}
					fontSize="lg"
					mb="4px"
					fontWeight="700"
					lineHeight="100%"
				>
					Filters
				</Text>
				<Button
					colorScheme="blue"
					size="sm"
				>
					Apply Filters
				</Button>
			</Flex>
			<Box px="25px">
				<SimpleGrid
					columns={{ sm: 1, md: 2, lg: 5 }}
					spacing={10}
				>
					{filters.map((filter) => {
						switch (filter.type) {
							case 'text':
								return (
									<FormControl key={`${filter.name}-text`}>
										<Flex
											width="100%"
											height="40px"
										>
											<Flex
												flex="4"
												alignItems="center"
												justifyContent="flex-start"
											>
												<FormLabel fontSize="sm">{filter.name}</FormLabel>
											</Flex>
											<Flex
												width="100%"
												flex="6"
												justifyContent="flex-start"
											>
												<Input
													type="text"
													defaultValue={filter.value}
													placeholder={filter.name}
													onChange={filter.onChange}
													size={'sm'}
												/>
											</Flex>
										</Flex>
									</FormControl>
								);
							case 'number':
								return (
									<FormControl key={`${filter.name}-number`}>
										<Flex
											width="100%"
											height="40px"
										>
											<Flex
												flex="4"
												alignItems="center"
												justifyContent="flex-start"
											>
												<FormLabel fontSize="sm">{filter.name}</FormLabel>
											</Flex>
											<Flex
												width="100%"
												flex="6"
												justifyContent="flex-start"
											>
												<NumberInput
													defaultValue={filter.value}
													onChange={filter.onChange}
													size={'sm'}
													placeholder={filter.name}
												>
													<NumberInputField />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											</Flex>
										</Flex>
									</FormControl>
								);
							case 'select':
								return (
									<FormControl key={`${filter.name}-select`}>
										<Flex
											width="100%"
											height="40px"
										>
											<Flex
												flex="4"
												alignItems="center"
												justifyContent="flex-start"
											>
												<FormLabel fontSize="sm">{filter.name}</FormLabel>
											</Flex>
											<Flex
												width="100%"
												flex="6"
												justifyContent="flex-start"
											>
												<Select
													defaultValue={filter.value}
													onChange={filter.onChange}
													placeholder="Seçiniz"
													size={'sm'}
												>
													{filter.options?.map((option) => (
														<option
															key={option.value}
															value={option.value}
														>
															{option.label}
														</option>
													))}
												</Select>
											</Flex>
										</Flex>
									</FormControl>
								);
							case 'boolean':
								return (
									<FormControl key={`${filter.name}-boolean`}>
										<Flex
											width="100%"
											height="40px"
										>
											<Flex
												flex="4"
												alignItems="center"
												justifyContent="flex-start"
											>
												<FormLabel fontSize="sm">{filter.name}</FormLabel>
											</Flex>
											<Flex
												width="100%"
												flex="6"
												justifyContent="flex-start"
											>
												<Switch
													defaultChecked={filter.value === 'true'}
													onChange={filter.onChange}
												/>
											</Flex>
										</Flex>
									</FormControl>
								);
							default:
								return null;
						}
					})}
				</SimpleGrid>
			</Box>
		</Card>
	);
};

export default Filters;
