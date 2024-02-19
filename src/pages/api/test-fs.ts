import connection from '@/server/lib/mysql';
import { getClientsDomains, updateDomains } from '@/server/services/veripagcor';
import { NextApiRequest, NextApiResponse } from 'next';
import ClientServices from '@/server/services/client';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const clients = await ClientServices.getClients();
	clients.forEach(async (client) => {
		const stripeCustomer = client.stripeCustomer;
		if (!stripeCustomer.email) {
			const d = await stripe.customers.update(stripeCustomer.id, {
				email: client.email || client.contactEmail,
			});
			console.log(d);
		}
	});
	res.status(200).json('ll');
};
