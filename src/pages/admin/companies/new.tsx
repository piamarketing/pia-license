import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function NewCompany() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [contact, setContact] = useState<string>('');
	const [licenseNumber, setLicenseNumber] = useState<string>('');
	const [type, setType] = useState<string>('');

	const handleSubmit = async () => {
		try {
			const res = await API.post(ENDPOINTS.companies, {
				name,
				address,
				type,
				email,
				contact,
				licenseNumber,
			});
			router.push('/admin/companies');
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
			requiredPermission="companies.create"
			_for="admin"
		>
			<Create
				sections={[
					{
						title: 'Company Information',
						formTemplate: [
							[
								{
									type: 'text',
									label: 'Company Name',
									placeholder: 'Enter company name',
									name: 'name',
									value: name,
									required: true,
									onChangeValue: (e: any) => {
										setName(e.target.value);
									},
								},
								{
									type: 'select',
									label: 'Company Type',
									placeholder: 'Select company type',
									name: 'type',
									value: type,
									required: true,
									onChangeValue: (e: any) => {
										setType(e.target.value);
									},
									options: [
										{
											label: 'Master',
											value: 'master',
										},
										{
											label: 'Sub',
											value: 'sub',
										},
									],
								},
							],
							[
								{
									type: 'text',
									label: 'Email Address',
									placeholder: 'Enter company email address',
									name: 'email',
									value: email,
									required: true,
									onChangeValue: (e: any) => {
										setEmail(e.target.value);
									},
								},
								{
									type: 'text',
									label: 'Authorized Person',
									placeholder: 'Enter authorized person',
									name: 'contact',
									value: contact,
									required: true,
									onChangeValue: (e: any) => {
										setContact(e.target.value);
									},
								},
							],
							[
								{
									type: 'text',
									label: 'License Number',
									placeholder: 'Enter license number',
									name: 'licenseNumber',
									value: licenseNumber,
									required: true,
									onChangeValue: (e: any) => {
										setLicenseNumber(e.target.value);
									},
								},
							],
							[
								{
									type: 'textarea',
									label: 'Address',
									placeholder: 'Enter company address',
									name: 'address',
									value: address,
									required: true,
									onChangeValue: (e: any) => {
										setAddress(e.target.value);
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
