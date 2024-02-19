import dbConnect from '@/server/lib/db';
import createApplication from '@/server/services/application';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'POST':
			// Check Permission
			//await checkPermission('clients.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				const application = await createApplication(req.body);
				// LOGDATA
				/*log({
					client: session._id,
					action: 'client-create',
					interaction: client._id,
					data: client,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: application, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
