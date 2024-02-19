import dbConnect from '@/server/lib/db';
import ClientServices from '@/server/services/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Client Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Client Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'POST':
			// Check Permission
			//await checkPermission('clients.create', session, req, res);
			// End: Check Permission
			try {
				const { id, productId } = req.body;
				const client = await ClientServices.createExtraInvoice(id, productId);
				// LOGDATA
				/*log({
					client: session._id,
					action: 'client-create',
					interaction: client._id,
					data: client,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: client, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
