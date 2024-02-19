// @tss-nocheck

import dbConnect from '@/server/lib/db';
import UserServices from '@/server/services/user';
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
			//await checkPermission('users.view', session, req, res);
			// End: Check Permission
			try {
				const user = await UserServices.getUserById(id as string);
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('users.edit', session, req, res);
			// End: Check Permission
			try {
				const user = await UserServices.updateUser(id as string, req.body);
				// LOGDATA
				/*log({
					user: session._id,
					action: 'user-update',
					interaction: user._id,
					data: user,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('users.delete', session, req, res);
			// End: Check Permission
			try {
				const user = await UserServices.deleteUser(id as string);
				// LOGDATA
				/*log({
					user: session._id,
					action: 'user-delete',
					interaction: user._id,
					data: user,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
