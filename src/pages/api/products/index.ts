import dbConnect from '@/server/lib/db';
import ProductServices from '@/server/services/product';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Product Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Product Data Gathering

	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'GET':
			// Check Permission
			//await checkPermission('products.view', session, req, res);
			// End: Check Permission
			try {
				const products = await ProductServices.getProducts();
				res.status(200).json({ data: products, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case 'POST':
			// Check Permission
			//await checkPermission('products.create', session, req, res);
			// End: Check Permission
			try {
				const payload = req.body;
				payload.merchant = session.merchant;
				const product = await ProductServices.createProduct(req.body);
				// LOGDATA
				/*log({
					product: session._id,
					action: 'product-create',
					interaction: product._id,
					data: product,
				});*/
				// End: LOGDATA
				res.status(201).json({ data: product, success: true });
			} catch (error: any) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
