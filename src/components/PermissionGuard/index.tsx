import { usePermission } from '@/hooks/usePermission';

export const PermissionGuard = ({
	requiredPermission,
	_for = 'all',
	children,
}: any) => {
	const hasPermission = usePermission(requiredPermission, _for);

	return hasPermission === 'pass' ? children : null;
};
