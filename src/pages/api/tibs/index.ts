import dbConnect from '@/server/lib/db';
import TibServices from '@/server/services/tib';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Tib Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Tib Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('tibs.view', session, req, res);
			// End: Check Permission
			try {
				const tibs = await TibServices.getTibs(session);
				res.status(200).json({ data: tibs, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('tibs.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				const tib = await TibServices.createTib(req.body, session);
				// LOGDATA
				/*log({
					tib: session._id,
					action: 'tib-create',
					interaction: tib._id,
					data: tib,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: tib, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
