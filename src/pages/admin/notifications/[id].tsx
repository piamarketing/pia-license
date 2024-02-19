import Create from '@/components/Create';
import { Form } from '@/components/Create/CreateTab';
import MainContainer from '@/components/MainContainer';
import { useEffect, useState } from 'react';
import API, { ENDPOINTS } from '@/lib/API';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

const MDEditor = dynamic(
	() => import('@uiw/react-md-editor').then((mod) => mod.default),
	{ ssr: false }
);
const EditerMarkdown = dynamic(
	() =>
		import('@uiw/react-md-editor').then((mod) => {
			return mod.default.Markdown;
		}),
	{ ssr: false }
);
const Markdown = dynamic(
	() => import('@uiw/react-markdown-preview').then((mod) => mod.default),
	{ ssr: false }
);

export default function NewNotification() {
	const toast = useToast();
	const router = useRouter();
	const [isReady, setIsReady] = useState(false);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const { id } = router.query;

	const { data, isLoading } = useQuery(
		['notifications', id],
		async () => {
			const res = await API.get(ENDPOINTS.notifications + `/${id}`);
			return res.data;
		},
		{
			enabled: !!id,
		}
	);

	useEffect(() => {
		console.log(data?.data);
		if (data?.data) {
			setTitle(data?.data?.title);
			setBody(data?.data?.body);
			setIsReady(true);
		}
	}, [data]);

	const handleUpdate = async () => {
		try {
			const res = await API.put(`${ENDPOINTS.notifications}/${id}`, {
				title,
				body,
			});
			router.push('/admin/notifications');
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
			requiredPermission="notifications.create"
			_for="admin"
		>
			{!isLoading && isReady && (
				<Create
					sections={[
						{
							title: 'Notification Information',
							formTemplate: [
								[
									{
										type: 'text',
										label: 'Notification Label',
										placeholder: 'Enter notification label',
										name: 'title',
										value: title,
										required: true,
										onChangeValue: (e: any) => {
											setTitle(e.target.value);
										},
									},
								],
								[
									{
										type: 'custom',
										label: 'Content (Supports Markdown)',
										name: 'body',
										required: true,
										value: body,
										render: (contentHolder: any, setContentHolder: any) => {
											return (
												<>
													<MDEditor
														value={
															contentHolder.length > 0 ? contentHolder : body
														}
														onChange={(e) => {
															setContentHolder(e);
															setBody(e);
														}}
													/>
												</>
											);
										},
									},
								],
							],
							onFinish: handleUpdate,
						},
					]}
				/>
			)}
		</MainContainer>
	);
}
