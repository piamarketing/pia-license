import { NextApiRequest, NextApiResponse } from 'next';
import TibServices from '@/server/services/tib';
import axios from 'axios';
import dbConnect from '@/server/lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { website } = req.query;
	try {
		await dbConnect();
		const start = Date.now();
		const checkTib = await TibServices.checkTibs();
		const end = Date.now();

		res.status(200).json({
			success: true,
			time: end - start,
			data: checkTib,
		});
	} catch (error: any) {
		console.log(error);
		res.status(400).json({ success: false, error: error.message });
	}
};
