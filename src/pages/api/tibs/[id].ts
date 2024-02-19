// @tss-nocheck

import dbConnect from '@/server/lib/db';
import TibServices from '@/server/services/tib';
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
			//await checkPermission('tibs.view', session, req, res);
			// End: Check Permission
			try {
				const tib = await TibServices.getTibById(id as string);
				res.status(200).json({ success: true, data: tib });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('tibs.edit', session, req, res);
			// End: Check Permission
			try {
				const tib = await TibServices.updateTib(id as string, req.body);
				// LOGDATA
				/*log({
					tib: session._id,
					action: 'tib-update',
					interaction: tib._id,
					data: tib,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: tib });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('tibs.delete', session, req, res);
			// End: Check Permission
			try {
				const tib = await TibServices.deleteTib(id as string);
				// LOGDATA
				/*log({
					tib: session._id,
					action: 'tib-delete',
					interaction: tib._id,
					data: tib,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: tib });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
