// @tss-nocheck

import dbConnect from '@/server/lib/db';
import CompanyServices from '@/server/services/company';
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
			//await checkPermission('companies.view', session, req, res);
			// End: Check Permission
			try {
				const company = await CompanyServices.getCompanyById(id as string);
				res.status(200).json({ success: true, data: company });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('companies.edit', session, req, res);
			// End: Check Permission
			try {
				const company = await CompanyServices.updateCompany(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					company: session._id,
					action: 'company-update',
					interaction: company._id,
					data: company,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: company });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('companies.delete', session, req, res);
			// End: Check Permission
			try {
				const company = await CompanyServices.deleteCompany(id as string);
				// LOGDATA
				/*log({
					company: session._id,
					action: 'company-delete',
					interaction: company._id,
					data: company,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: company });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
