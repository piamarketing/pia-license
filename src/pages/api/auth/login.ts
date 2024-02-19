import dbConnect from '@/server/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import AuthServices from '@/server/services/auth';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { method } = req;
	await dbConnect();

	switch (method) {
		case 'POST':
			try {
				console.log(1);
				const user = await AuthServices.login(
					req.body.email,
					req.body.password
				);
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
