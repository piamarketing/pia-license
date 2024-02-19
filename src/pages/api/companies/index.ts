import dbConnect from '@/server/lib/db';
import CompanyServices from '@/server/services/company';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Company Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Company Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('companies.view', session, req, res);
			// End: Check Permission
			try {
				const companies = await CompanyServices.getCompanies();
				res.status(200).json({ data: companies, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('companies.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				const company = await CompanyServices.createCompany(req.body);
				// LOGDATA
				/*log({
					company: session._id,
					action: 'company-create',
					interaction: company._id,
					data: company,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: company, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
