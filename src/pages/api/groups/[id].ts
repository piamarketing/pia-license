// @tss-nocheck

import dbConnect from '@/server/lib/db';
import GroupServices from '@/server/services/group';
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
			//await checkPermission('groups.view', session, req, res);
			// End: Check Permission
			try {
				const group = await GroupServices.getGroupById(id as string);
				res.status(200).json({ success: true, data: group });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('groups.edit', session, req, res);
			// End: Check Permission
			try {
				const group = await GroupServices.updateGroup(id as string, req.body);
				// LOGDATA
				/*log({
					group: session._id,
					action: 'group-update',
					interaction: group._id,
					data: group,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: group });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('groups.delete', session, req, res);
			// End: Check Permission
			try {
				const group = await GroupServices.deleteGroup(id as string);
				// LOGDATA
				/*log({
					group: session._id,
					action: 'group-delete',
					interaction: group._id,
					data: group,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: group });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
