import { NextApiRequest, NextApiResponse } from 'next';
import InvoiceServices from '@/server/services/invoice';
import axios from 'axios';
import dbConnect from '@/server/lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { website } = req.query;
	try {
		await dbConnect();
		const start = Date.now();
		const invs = await InvoiceServices.createInvoicesForClients();
		const end = Date.now();

		res.status(200).json({
			success: true,
			time: end - start,
			data: invs,
		});
	} catch (error: any) {
		console.log(error);
		res.status(400).json({ success: false, error: error.message });
	}
};
