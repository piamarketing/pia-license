// @tss-nocheck

import dbConnect from '@/server/lib/db';
import NotificationServices from '@/server/services/notification';
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
			//await checkPermission('notifications.view', session, req, res);
			// End: Check Permission
			try {
				const notification = await NotificationServices.getNotificationById(
					id as string
				);
				res.status(200).json({ success: true, data: notification });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('notifications.edit', session, req, res);
			// End: Check Permission
			try {
				const notification = await NotificationServices.updateNotification(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					notification: session._id,
					action: 'notification-update',
					interaction: notification._id,
					data: notification,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: notification });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('notifications.delete', session, req, res);
			// End: Check Permission
			try {
				const notification = await NotificationServices.deleteNotification(
					id as string
				);
				// LOGDATA
				/*log({
					notification: session._id,
					action: 'notification-delete',
					interaction: notification._id,
					data: notification,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: notification });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
