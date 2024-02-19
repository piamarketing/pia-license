import MainContainer from '@/components/MainContainer';
import { useRouter } from 'next/router';
import ClientDetails from '@/components/ClientDetails';

export default function Client() {
	const router = useRouter();
	const { id } = router.query;

	return (
		<MainContainer
			requiredPermission="clients.view"
			_for="all"
		>
			{id && <ClientDetails id={id} />}
		</MainContainer>
	);
}
