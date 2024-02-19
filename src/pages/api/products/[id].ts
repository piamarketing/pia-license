// @tss-nocheck

import dbConnect from '@/server/lib/db';
import ProductServices from '@/server/services/product';
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
			//await checkPermission('products.view', session, req, res);
			// End: Check Permission
			try {
				const product = await ProductServices.getProductById(id as string);
				res.status(200).json({ success: true, data: product });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			// Check Permission
			//await checkPermission('products.edit', session, req, res);
			// End: Check Permission
			try {
				const product = await ProductServices.updateProduct(
					id as string,
					req.body
				);
				// LOGDATA
				/*log({
					product: session._id,
					action: 'product-update',
					interaction: product._id,
					data: product,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: product });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			// Check Permission
			//await checkPermission('products.delete', session, req, res);
			// End: Check Permission
			try {
				const product = await ProductServices.deleteProduct(id as string);
				// LOGDATA
				/*log({
					product: session._id,
					action: 'product-delete',
					interaction: product._id,
					data: product,
				});*/
				// End: LOGDATA
				res.status(200).json({ success: true, data: product });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
