// @tss-nocheck

import dbConnect from '@/server/lib/db';
import PlanServices from '@/server/services/plan';
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
			//await checkPermission('plan.view', session, req, res);
			// End: Check Permission
			try {
				const plan = await PlanServices.getPlanById(id as string);
				res.status(200).json({ success: true, data: plan });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('plan.edit', session, req, res);
			// End: Check Permission
			try {
				const plan = await PlanServices.updatePlan(id as string, req.body);
				// LOGDATA
				/*log({
					plan: session._id,
					action: 'plan-update',
					interaction: plan._id,
					data: plan,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: plan });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('plan.delete', session, req, res);
			// End: Check Permission
			try {
				const plan = await PlanServices.deletePlan(id as string);
				// LOGDATA
				/*log({
					plan: session._id,
					action: 'plan-delete',
					interaction: plan._id,
					data: plan,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: plan });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
