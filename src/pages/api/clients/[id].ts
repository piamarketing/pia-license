// @tss-nocheck

import dbConnect from '@/server/lib/db';
import ClientServices from '@/server/services/client';
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
			//await checkPermission('clients.view', session, req, res);
			// End: Check Permission
			try {
				const client = await ClientServices.getClientById(id as string);
				res.status(200).json({ success: true, data: client });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('clients.edit', session, req, res);
			// End: Check Permission
			try {
				const client = await ClientServices.updateClient(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					client: session._id,
					action: 'client-update',
					interaction: client._id,
					data: client,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: client });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('clients.delete', session, req, res);
			// End: Check Permission
			try {
				const client = await ClientServices.deleteClient(id as string);
				// LOGDATA
				/*log({
					client: session._id,
					action: 'client-delete',
					interaction: client._id,
					data: client,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: client });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
