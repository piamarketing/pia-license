import {
	Flex,
	Box,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	TableCellProps,
} from '@chakra-ui/react';
import Card from '@/lib/ui/horizon/components/card/Card';
import Filters, { Filter } from './Filters';
import Pagnition, { PagnitionProps } from './Pagnition';

export interface Cell extends TableCellProps {
	label: string;
	renderCell: (row: any) => React.ReactNode;
}

export interface ListProps {
	title: string;
	isLoading?: boolean;
	data: Array<any>;
	cells: Array<Cell> | undefined;
	pagnition?: PagnitionProps;
	filters?: Array<Filter>;
	rightMenu?: (data: any) => React.ReactNode;
	leftMenu?: (data: any) => React.ReactNode;
}

const List = ({
	title,
	isLoading = false,
	data,
	cells,
	filters,
	pagnition,
	rightMenu,
	leftMenu,
}: ListProps) => {
	const secondaryColor = useColorModeValue('secondaryGray.900', 'white');
	const thColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	return (
		<>
			{filters && <Filters filters={filters} />}
			<Card
				flexDirection="column"
				w="100%"
				px="0px"
				//overflowX={{ sm: 'scroll', lg: 'hidden' }}
				mt="3"
			>
				<Text
					color={secondaryColor}
					fontSize="lg"
					mb="20px"
					px="25px"
					fontWeight="700"
					lineHeight="100%"
				>
					{title}
				</Text>
				<Flex
					px="25px"
					mb="8px"
					justifyContent="space-between"
					align="center"
				>
					{leftMenu && leftMenu(data)}
					{rightMenu && rightMenu(data)}
				</Flex>
				<Box px="25px">
					{!isLoading && (
						<>
							<Table
								variant="striped"
								colorScheme="gray"
								borderRadius="10px"
								size="sm"
								overflowX={{ sm: 'scroll', lg: 'scroll' }}
								maxW="100%"
							>
								<Thead>
									<Tr>
										{cells?.map((cell, index) => (
											<Th
												key={`ListTh-${index}`}
												pe="10px"
												borderColor={thColor}
												cursor="pointer"
												isNumeric={cell.isNumeric}
											>
												{cell.label}
											</Th>
										))}
									</Tr>
								</Thead>
								<Tbody>
									{data.map((item, index) => (
										<Tr key={`ListTr-${index}`}>
											{cells?.map((cell, index) => (
												<Td
													{...cell}
													key={`ListTd-${index}`}
													minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												>
													<>{cell.renderCell(item)}</>
												</Td>
											))}
										</Tr>
									))}
								</Tbody>
							</Table>
							{pagnition && <Pagnition {...pagnition} />}
						</>
					)}
				</Box>
			</Card>
		</>
	);
};

export default List;
