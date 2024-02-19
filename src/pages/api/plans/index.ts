import dbConnect from '@/server/lib/db';
import PlanServices from '@/server/services/plan';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Plan Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Plan Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('plans.view', session, req, res);
			// End: Check Permission
			try {
				const plans = await PlanServices.getPlans();
				res.status(200).json({ data: plans, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('plans.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const plan = await PlanServices.createPlan(req.body);
				// LOGDATA
				/*log({
					plan: session._id,
					action: 'plan-create',
					interaction: plan._id,
					data: plan,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: plan, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
