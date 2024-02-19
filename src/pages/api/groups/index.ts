import dbConnect from '@/server/lib/db';
import GroupServices from '@/server/services/group';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Group Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Group Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('groups.view', session, req, res);
			// End: Check Permission
			try {
				const groups = await GroupServices.getGroups();
				res.status(200).json({ data: groups, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('groups.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const group = await GroupServices.createGroup(req.body);
				// LOGDATA
				/*log({
					group: session._id,
					action: 'group-create',
					interaction: group._id,
					data: group,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: group, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
