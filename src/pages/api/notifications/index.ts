import dbConnect from '@/server/lib/db';
import NotificationServices from '@/server/services/notification';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Notification Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Notification Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('companies.view', session, req, res);
			// End: Check Permission
			try {
				const companies = await NotificationServices.getNotifications();
				res.status(200).json({ data: companies, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('companies.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				const notification = await NotificationServices.createNotification(
					req.body
				);
				// LOGDATA
				/*log({
					notification: session._id,
					action: 'notification-create',
					interaction: notification._id,
					data: notification,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: notification, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
