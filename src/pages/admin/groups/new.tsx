import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function NewGroup() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [rate, setRate] = useState<number>(0);

	const handleSubmit = async () => {
		console.log(name, rate);
		try {
			const res = await API.post(ENDPOINTS.groups, {
				name,
				rate,
			});
			router.push('/admin/groups');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
		}
	};

	return (
		<MainContainer
			requiredPermission="groups.create"
			_for="admin"
		>
			<Create
				sections={[
					{
						title: 'Group Information',
						formTemplate: [
							[
								{
									type: 'text',
									label: 'Group Name',
									placeholder: 'Enter group name',
									name: 'name',
									value: name,
									required: true,
									onChangeValue: (e: any) => {
										setName(e.target.value);
									},
								},
								{
									type: 'number',
									label: 'Comission',
									placeholder: 'Enter comission',
									name: 'comission',
									value: rate,
									required: true,
									onChangeValue: (e: any) => {
										setRate(e.target.value);
									},
								},
							],
						],
						onFinish: handleSubmit,
					},
				]}
			/>
		</MainContainer>
	);
}
