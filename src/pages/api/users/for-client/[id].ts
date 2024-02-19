// @tss-nocheck

import dbConnect from '@/server/lib/db';
import UserServices from '@/server/services/user';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth/next';
import { options } from '../../auth/[...nextauth]';
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
		case 'POST':
			// Check Permission
			//await checkPermission('users.view', session, req, res);
			// End: Check Permission
			try {
				const user = await UserServices.createUserForClient(
					req.body,
					id as string
				);
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
