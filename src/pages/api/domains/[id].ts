// @tss-nocheck

import dbConnect from '@/server/lib/db';
import DomainServices from '@/server/services/domain';
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
			//await checkPermission('domains.view', session, req, res);
			// End: Check Permission
			try {
				const domain = await DomainServices.getDomainById(id as string);
				res.status(200).json({ success: true, data: domain });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('domains.edit', session, req, res);
			// End: Check Permission
			try {
				const domain = await DomainServices.updateDomain(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					domain: session._id,
					action: 'domain-update',
					interaction: domain._id,
					data: domain,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: domain });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('domains.delete', session, req, res);
			// End: Check Permission
			try {
				const domain = await DomainServices.deleteDomain(id as string);
				// LOGDATA
				/*log({
					domain: session._id,
					action: 'domain-delete',
					interaction: domain._id,
					data: domain,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: domain });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
