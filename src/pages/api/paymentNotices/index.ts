import dbConnect from '@/server/lib/db';
import PaymentNoticeServices from '@/server/services/paymentNotice';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// PaymentNotice Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: PaymentNotice Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('paymentNotices.view', session, req, res);
			// End: Check Permission
			try {
				const paymentNotices = await PaymentNoticeServices.getPaymentNotices(
					session
				);
				res.status(200).json({ data: paymentNotices, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('paymentNotices.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const paymentNotice = await PaymentNoticeServices.createPaymentNotice(
					req.body,
					session
				);
				// LOGDATA
				/*log({
					paymentNotice: session._id,
					action: 'paymentNotice-create',
					interaction: paymentNotice._id,
					data: paymentNotice,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: paymentNotice, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
