// @tss-nocheck

import dbConnect from '@/server/lib/db';
import TicketServices from '@/server/services/ticket';
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
		case 'PUT':
			// Check Permission
			//await checkPermission('tickets.edit', session, req, res);
			// End: Check Permission
			try {
				const { admin } = req.body;
				const ticket = await TicketServices.takeTicket(id as string, admin);
				// LOGDATA
				/*log({
					ticket: session._id,
					action: 'ticket-update',
					interaction: ticket._id,
					data: ticket,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: ticket });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
