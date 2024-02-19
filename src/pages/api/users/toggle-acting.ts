import dbConnect from '@/server/lib/db';
import UserServices from '@/server/services/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { options } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// User Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: User Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'POST':
			// Check Permission
			//await checkPermission('users.create', session, req, res);
			// End: Check Permission
			try {
				const { id } = req.body;
				const acting = id ? id : null;
				const user = await UserServices.toggleActing(acting, session);
				// LOGDATA
				/*log({
					user: session._id,
					action: 'user-create',
					interaction: user._id,
					data: user,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: user, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
