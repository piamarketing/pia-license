// @tss-nocheck

import dbConnect from '@/server/lib/db';
import PaymentNoticeServices from '@/server/services/paymentNotice';
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
			//await checkPermission('paymentNotices.view', session, req, res);
			// End: Check Permission
			try {
				const paymentNotice = await PaymentNoticeServices.getPaymentNoticeById(
					id as string
				);
				res.status(200).json({ success: true, data: paymentNotice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('paymentNotices.edit', session, req, res);
			// End: Check Permission
			try {
				const paymentNotice = await PaymentNoticeServices.updatePaymentNotice(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					paymentNotice: session._id,
					action: 'paymentNotice-update',
					interaction: paymentNotice._id,
					data: paymentNotice,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: paymentNotice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('paymentNotices.delete', session, req, res);
			// End: Check Permission
			try {
				const paymentNotice = await PaymentNoticeServices.deletePaymentNotice(
					id as string
				);
				// LOGDATA
				/*log({
					paymentNotice: session._id,
					action: 'paymentNotice-delete',
					interaction: paymentNotice._id,
					data: paymentNotice,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: paymentNotice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
