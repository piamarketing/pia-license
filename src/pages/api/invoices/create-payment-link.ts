import dbConnect from '@/server/lib/db';
import InvoiceServices from '@/server/services/invoice';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Invoice Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Invoice Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'POST':
			// Check Permission
			//await checkPermission('invoices.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				const invoice = await InvoiceServices.createStripePaymentLink(payload);
				// LOGDATA
				/*log({
					invoice: session._id,
					action: 'invoice-create',
					interaction: invoice._id,
					data: invoice,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: invoice, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
