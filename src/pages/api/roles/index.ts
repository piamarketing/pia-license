import dbConnect from '@/server/lib/db';
import RoleServices from '@/server/services/role';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Role Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Role Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('roles.view', session, req, res);
			// End: Check Permission
			try {
				const roles = await RoleServices.getRoles(session);
				res.status(200).json({ data: roles, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('roles.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const role = await RoleServices.createRole(req.body, session);
				// LOGDATA
				/*log({
					role: session._id,
					action: 'role-create',
					interaction: role._id,
					data: role,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: role, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
