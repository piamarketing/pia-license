import dbConnect from '@/server/lib/db';
import TicketServices from '@/server/services/ticket';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Ticket Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Ticket Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('tickets.view', session, req, res);
			// End: Check Permission
			try {
				const tickets = await TicketServices.getTickets(session);
				res.status(200).json({ data: tickets, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('tickets.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const ticket = await TicketServices.createTicket(req.body);
				// LOGDATA
				/*log({
					ticket: session._id,
					action: 'ticket-create',
					interaction: ticket._id,
					data: ticket,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: ticket, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
