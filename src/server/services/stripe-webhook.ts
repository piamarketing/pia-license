const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import Invoice from '../models/Invoice';
import Client from '../models/Client';
import Plan from '../models/Plan';
import Domain from '../models/Domain';

export const stripeWebhook = async (req) => {
	const { type, data } = req.body;

	// Check if type invoice.payment_succeeded
	if (type === 'invoice.payment_succeeded') {
		const invoice = await stripe.invoices.retrieve(data.object.id);
		const { paid } = invoice;

		if (paid) {
			const invoiceData = await Invoice.findOne({
				'stripeData.id': invoice.id,
			});

			if (!invoiceData) {
				return false;
			}

			const clientData = await Client.findOne({
				_id: invoiceData.client,
			}).populate('planType');

			const planData = await Plan.findOne({
				_id: clientData.planType._id,
			}).populate('products');

			console.log(planData);
			console.log(clientData);

			if (invoiceData._for === 'license') {
				// Check if products have any product with type recurring
				let validUntilExtraDays = 0;

				planData.products.forEach((product) => {
					if (product.type === 'recurring') {
						validUntilExtraDays += product.duration;
					}
				});

				// Update client
				await Client.updateOne(
					{ _id: clientData._id },
					{
						$set: {
							license: {
								validUntil: new Date(
									new Date().getTime() +
										validUntilExtraDays * 24 * 60 * 60 * 1000
								),
							},
							isActive: true,
						},
					}
				);
			}

			if (invoiceData._for === 'domain') {
				// Update domain
				await Domain.updateOne(
					{ _id: invoiceData.domain },
					{
						$set: {
							isActive: true,
						},
					}
				);
			}

			// Update invoice
			await Invoice.updateOne(
				{ _id: invoiceData._id },
				{
					$set: {
						status: 'paid',
						paidAt: new Date(),
					},
				}
			);
		}
	}

	return true;
};
