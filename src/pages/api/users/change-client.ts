import dbConnect from '@/server/lib/db';
import UserServices from '@/server/services/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// User Data Gathering
	// const session: any = await getServerSession(req, res, options);
	// End: User Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		
		case 'POST':
			// Check Permission
			//await checkPermission('users.create', session, req, res);
			// End: Check Permission
			try {
				const user = await UserServices.changeClient(req.body.id, req.body.website);
				
				res.status(200).json({ data: user, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
