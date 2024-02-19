import dbConnect from '@/server/lib/db';
import { dashboard } from '@/server/services/report';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Group Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Group Data Gathering

	const { method } = req;
	await dbConnect();

	// Check Permission
	//await checkPermission('groups.view', session, req, res);
	// End: Check Permission
	try {
		const report = await dashboard(session);
		res.status(200).json({ data: report, success: true });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
}
