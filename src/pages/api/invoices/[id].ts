// @tss-nocheck

import dbConnect from '@/server/lib/db';
import InvoiceServices from '@/server/services/invoice';
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
			//await checkPermission('invoices.view', session, req, res);
			// End: Check Permission
			try {
				const invoice = await InvoiceServices.getInvoiceById(id as string);
				res.status(200).json({ success: true, data: invoice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('invoices.edit', session, req, res);
			// End: Check Permission
			try {
				const invoice = await InvoiceServices.updateInvoice(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					invoice: session._id,
					action: 'invoice-update',
					interaction: invoice._id,
					data: invoice,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: invoice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('invoices.delete', session, req, res);
			// End: Check Permission
			try {
				const invoice = await InvoiceServices.deleteInvoice(id as string);
				// LOGDATA
				/*log({
					invoice: session._id,
					action: 'invoice-delete',
					interaction: invoice._id,
					data: invoice,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: invoice });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
