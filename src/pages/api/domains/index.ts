import dbConnect from '@/server/lib/db';
import DomainServices from '@/server/services/domain';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Domain Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Domain Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('domains.view', session, req, res);
			// End: Check Permission
			try {
				const domains = await DomainServices.getDomains(session);
				res.status(200).json({ data: domains, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('domains.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const domain = await DomainServices.createDomain(req.body, session);
				// LOGDATA
				/*log({
					domain: session._id,
					action: 'domain-create',
					interaction: domain._id,
					data: domain,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: domain, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
