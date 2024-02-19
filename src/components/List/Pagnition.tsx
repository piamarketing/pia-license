import { Box, Center, Flex, HStack } from '@chakra-ui/react';

const Page = ({ pageNumber, activePage, onClick }: any) => {
	return (
		<Box
			height="32px"
			width="32px"
			textAlign="center"
			bgColor={activePage === pageNumber ? 'blue.500' : 'gray.100'}
			borderRadius="sm"
			display="flex"
			alignItems="center"
			justifyContent="center"
			color={activePage === pageNumber ? 'white' : 'gray.500'}
			cursor="pointer"
			onClick={onClick}
		>
			{pageNumber}
		</Box>
	);
};

export interface PagnitionProps {
	currentPage: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}

// component with children
const Pagnition = ({
	currentPage,
	totalPages,
	onChangePage,
}: PagnitionProps) => {
	const handlePageChange = (page: number) => {
		onChangePage(page);
	};

	return (
		<Center mt="2rem">
			<HStack>
				{Array.from(Array(totalPages).keys()).map((page) => {
					if (page === 0 || page === totalPages - 1) {
						return (
							<Page
								key={`page-${page}`}
								pageNumber={page + 1}
								activePage={currentPage}
								onClick={() => handlePageChange(page + 1)}
							/>
						);
					} else if (
						page === currentPage - 1 ||
						page === currentPage ||
						page === currentPage + 1
					) {
						return (
							<Page
								key={`page-${page}`}
								pageNumber={page + 1}
								activePage={currentPage}
								onClick={() => handlePageChange(page + 1)}
							/>
						);
					} else if (page === currentPage - 2 || page === currentPage + 2) {
						return (
							<Page
								key={`page-${page}`}
								pageNumber="..."
								activePage={currentPage}
								onClick={() => handlePageChange(page + 1)}
							/>
						);
					}
				})}
			</HStack>
		</Center>
	);
};

export default Pagnition;
