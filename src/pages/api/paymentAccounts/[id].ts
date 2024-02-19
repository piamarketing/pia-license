// @tss-nocheck

import dbConnect from '@/server/lib/db';
import PaymentAccountServices from '@/server/services/paymentAccount';
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
			//await checkPermission('paymentAccounts.view', session, req, res);
			// End: Check Permission
			try {
				const paymentAccount =
					await PaymentAccountServices.getPaymentAccountById(id as string);
				res.status(200).json({ success: true, data: paymentAccount });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('paymentAccounts.edit', session, req, res);
			// End: Check Permission
			try {
				const paymentAccount =
					await PaymentAccountServices.updatePaymentAccount(
						id as string,
						req.body
					);
				// LOGDATA
				/*log({
					paymentAccount: session._id,
					action: 'paymentAccount-update',
					interaction: paymentAccount._id,
					data: paymentAccount,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: paymentAccount });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('paymentAccounts.delete', session, req, res);
			// End: Check Permission
			try {
				const paymentAccount =
					await PaymentAccountServices.deletePaymentAccount(id as string);
				// LOGDATA
				/*log({
					paymentAccount: session._id,
					action: 'paymentAccount-delete',
					interaction: paymentAccount._id,
					data: paymentAccount,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: paymentAccount });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
