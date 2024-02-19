import React, { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	SimpleGrid,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import Card from '@/lib/ui/horizon/components/card/Card';
import CreateTab, { CreateTabProps } from './CreateTab';

/**
 * export interface CreateTabProps {
	title: string;
	formTemplate: Array<Array<Form>>;
	onClickNext?: () => void;
	onClickBack?: () => void;
}
 */
interface CreateProps {
	sections: Array<CreateTabProps>;
	onFinish?: () => void;
}

const Create = ({ sections, onFinish }: CreateProps) => {
	// Generate active bullets from sections
	const [activeBullets, setActiveBullets] = useState(
		// Only the first tab is active
		// So we need to calculate the active bullets
		sections.reduce((acc: any, curr: any, index) => {
			acc[curr.title] = index === 0;
			return acc;
		}, {})
	);

	// Generate refs for each tab
	const refs = sections.reduce((acc: any, curr: any) => {
		acc[curr.title] = React.createRef();
		return acc;
	}, {});

	return (
		<Flex
			direction="column"
			minH="100vh"
			align="center"
			position="relative"
		>
			<Box
				h="45vh"
				bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
				position="absolute"
				w="100%"
				borderRadius="30px"
			/>
			<Tabs
				variant="unstyled"
				zIndex="0"
				mt={{ base: '60px', md: '85px' }}
				display="flex"
				flexDirection="column"
			>
				<TabList
					display="flex"
					alignItems="center"
					alignSelf="center"
					justifySelf="center"
				>
					{sections.map((section, index) => {
						return (
							<Tab
								ref={refs[section.title]}
								px="25px"
								onClick={(e) => {
									// Make true all the previous bullets
									const newActiveBullets = { ...activeBullets };
									for (let i = 0; i <= index; i++) {
										newActiveBullets[sections[i].title] = true;
									}
									// Make false all the next bullets
									for (let i = index + 1; i < sections.length; i++) {
										newActiveBullets[sections[i].title] = false;
									}

									// Update the state
									setActiveBullets(newActiveBullets);
								}}
								key={index}
							>
								<Flex
									direction="column"
									justify="center"
									align="center"
									position="relative"
									// Add a line to connect the bullets
									/*_before={{
										content: '""',
										position: 'absolute',
										top: '10%',
										left: '-94px',
										width: '150%',
										height: '2px',
										bg: activeBullets[section.title] ? 'white' : '#8476FF',
										transform: 'translateY(-50%)',
										display: index === 0 ? 'none' : 'block',
										transition: 'all 0.3s ease-in-out',
									}}*/
								>
									<Box
										zIndex="1"
										border="2px solid"
										borderColor={
											activeBullets[section.title] ? 'white' : '#8476FF'
										}
										bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
										w="16px"
										h="16px"
										mb="8px"
										borderRadius="50%"
									/>
									<Text
										color={activeBullets[section.title] ? 'white' : 'gray.300'}
										fontWeight={
											activeBullets[section.title] ? 'bold' : 'normal'
										}
										display={{ sm: 'none', md: 'block' }}
									>
										{section.title}
									</Text>
								</Flex>
							</Tab>
						);
					})}
				</TabList>
				<TabPanels
					mt="24px"
					maxW={{ md: '90%', lg: '100%' }}
					mx="auto"
				>
					{sections.map((section, index) => {
						return (
							<CreateTab
								key={index}
								title={section.title}
								formTemplate={section.formTemplate}
								onClickNext={() => {
									section.onClickNext?.();
									refs[sections[index + 1].title].current?.click();
								}}
								onClickBack={() => {
									section.onClickBack?.();
									refs[sections[index - 1].title].current?.click();
								}}
								onFinish={section.onFinish}
							/>
						);
					})}
				</TabPanels>
			</Tabs>
		</Flex>
	);
};

export default Create;
