// @ts-nocheck

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const usePermission = (
	requiredPermission: string,
	_for = 'all',
	service = 'all'
) => {
	const { data: session, status } = useSession();
	const hasPermission = 'block';
	if (requiredPermission) {
		if (status === 'loading') {
			return 'waiting';
		}
		if (status === 'unauthenticated') {
			return 'unauthenticated';
		}
		if (status === 'authenticated') {
			if (_for === 'admin') {
				if (session.isSuperAdmin) {
					return 'pass';
				}
				if (session.role?.permissions) {
					if (session.role?.permissions.includes(requiredPermission)) {
						return 'pass';
					}
				}
			}
			if (_for === 'client') {
				if (session.type === 'client') {
					// TODO
					if (service === 'all') {
						return 'pass';
					}
					return 'pass';
				}
			}
			if (_for === 'all') {
				if (session.isSuperAdmin) {
					return 'pass';
				}
				if (session.role?.permissions) {
					if (session.role?.permissions.includes(requiredPermission)) {
						return 'pass';
					}
				}
				if (session.type === 'client') {
					// TODO
					if (service === 'all') {
						return 'pass';
					}
					return 'pass';
				}
			}
		}
	}
	/*} else {
		return 'pass';
	}*/

	return hasPermission;
};
