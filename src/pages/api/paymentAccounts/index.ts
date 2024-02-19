import dbConnect from '@/server/lib/db';
import PaymentAccountServices from '@/server/services/paymentAccount';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// PaymentAccount Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: PaymentAccount Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('paymentAccounts.view', session, req, res);
			// End: Check Permission
			try {
				const paymentAccounts =
					await PaymentAccountServices.getPaymentAccounts();
				res.status(200).json({ data: paymentAccounts, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('paymentAccounts.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const paymentAccount =
					await PaymentAccountServices.createPaymentAccount(req.body);
				// LOGDATA
				/*log({
					paymentAccount: session._id,
					action: 'paymentAccount-create',
					interaction: paymentAccount._id,
					data: paymentAccount,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: paymentAccount, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
