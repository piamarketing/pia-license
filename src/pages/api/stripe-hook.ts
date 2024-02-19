import dbConnect from '@/server/lib/db';
import ProductServices from '@/server/services/product';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from './auth/[...nextauth]';
import { stripeWebhook } from '@/server/services/stripe-webhook';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Product Data Gathering
	const session: any = await getServerSession(req, res, options);
	// End: Product Data Gathering

	console.log(session);
	await dbConnect();

	const resp = stripeWebhook(req);
	console.log(resp);

	res.status(200).json({ data: true, success: true });
}
