import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Home() {
	const router = useRouter();
	const toast = useToast();
	const { data, isLoading, error } = useQuery('roles', () =>
		API.get(ENDPOINTS.roles)
	);

	const [nameSurname, setNameSurname] = useState<string>('');
	const [skype, setSkype] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [role, setRole] = useState<string>('');
	const [isEnabled, setIsEnabled] = useState<boolean>(true);

	const handleSubmit = async () => {
		try {
			const response = await API.post(ENDPOINTS.users, {
				nameSurname,
				skype,
				email,
				password,
				role,
				isEnabled,
			});
			toast({
				title: 'Affiliate created',
				description: 'Affiliate created successfully',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			router.push('/admin/users');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<MainContainer
			requiredPermission="users.create"
			_for="admin"
		>
			{!isLoading && (
				<Create
					sections={[
						{
							title: 'Personal Information',
							formTemplate: [
								[
									{
										type: 'text',
										label: 'Name Surname',
										placeholder: 'Enter name surname',
										name: 'nameSurname',
										value: nameSurname,
										required: true,
										onChangeValue: (e: any) => {
											setNameSurname(e.target.value);
										},
									},
									{
										type: 'text',
										label: 'Skype',
										placeholder: 'Enter skype',
										name: 'skype',
										value: skype,
										required: true,
										onChangeValue: (e: any) => {
											setSkype(e.target.value);
										},
									},
								],
								[
									{
										type: 'text',
										label: 'Email',
										placeholder: 'Enter email',
										name: 'email',
										value: email,
										required: true,
										onChangeValue: (e: any) => {
											setEmail(e.target.value);
										},
									},
									{
										type: 'text',
										label: 'Password',
										placeholder: 'Enter password',
										name: 'password',
										value: password,
										required: true,
										onChangeValue: (e: any) => {
											setPassword(e.target.value);
										},
									},
								],
							],
							onClickNext: () => console.log('Next'),
						},
						{
							title: 'Group',
							formTemplate: [
								[
									{
										type: 'select',
										label: 'Role',
										placeholder: 'Select role',
										name: 'role',
										value: role,
										required: true,
										onChangeValue: (e: any) => {
											setRole(e.target.value);
										},
										options: isLoading
											? []
											: data?.data?.data.map((item: any) => ({
													label: item.name,
													value: item._id,
											  })),
									},
								],
								[
									{
										type: 'boolean',
										label: 'Enabled',
										placeholder: '',
										name: 'enabled',
										value: true,
										required: true,
										onChangeValue: (e: any) => {
											setIsEnabled(e.target.value);
										},
									},
								],
							],
							onFinish: () => handleSubmit(),
						},
					]}
				/>
			)}
		</MainContainer>
	);
}
