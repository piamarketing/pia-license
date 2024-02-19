// @tss-nocheck

import dbConnect from '@/server/lib/db';
import RoleServices from '@/server/services/role';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
//import { checkPermission } from '@/server/lib/permission';

//import log from '@/server/utils/log';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// User Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: User Data Gathering

	const { method } = req;
	const { id } = req.query;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('roles.view', session, req, res);
			// End: Check Permission
			try {
				const role = await RoleServices.getRoleById(id as string, session);
				res.status(200).json({ success: true, data: role });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('roles.edit', session, req, res);
			// End: Check Permission
			try {
				const role = await RoleServices.updateRole(
					id as string,
					req.body,
					session
				);
				// LOGDATA
				/*log({
					role: session._id,
					action: 'role-update',
					interaction: role._id,
					data: role,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: role });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('roles.delete', session, req, res);
			// End: Check Permission
			try {
				const role = await RoleServices.deleteRole(id as string, session);
				// LOGDATA
				/*log({
					role: session._id,
					action: 'role-delete',
					interaction: role._id,
					data: role,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: role });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
