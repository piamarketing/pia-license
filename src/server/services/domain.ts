// @tss-nocheck
import Domain from '@/server/models/Domain';
import Invoice from '@/server/models/Invoice';
import Client from '../models/Client';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const getDomains = async (session) => {
	const adfilters =
		session?.type === 'client'
			? {
					normal: { client: session.client._id },
					aggregate: { $match: { client: session.client._id } },
			  }
			: {
					normal: {},
					aggregate: {
						$match: {
							_id: {
								$ne: null,
							},
						},
					},
			  };
	try {
		const domains = await Domain.find({ ...adfilters.normal }).populate(
			'client'
		);
		return domains;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getDomainById = async (id: string) => {
	try {
		const domain = await Domain.findOne({
			_id: id,
		});
		return domain;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createDomain = async (domain: any) => {
	try {
		/*const { error } = validateDomain(domain);
		if (error) {
			throw error;
		}*/
		if (domain.totalPrice <= 0) {
			domain.isActive = true;

			const newDomain = new Domain(domain);
			await newDomain.save();
		} else {
			const client = await Client.findOne({
				_id: domain.client,
			}).populate('planType');
			// New stripe invoice
			const stripeInvoice = await stripe.invoices.create({
				customer: client.stripeCustomer.id,
				collection_method: 'send_invoice',
				days_until_due: 0,
			});

			const domainPriceId = client.revisedDomainPrice
				? client.revisedDomainStripeData.price.id
				: client.planType.domainStripeData.price.id;

			// Add items
			let stripeInvoiceItems = [];
			for (let i = 0; i < domain.domains.length; i++) {
				const stripeProduct = await stripe.invoiceItems.create({
					invoice: stripeInvoice.id,
					customer: client.stripeCustomer.id,
					price: domainPriceId,
				});
				stripeInvoiceItems.push(stripeProduct);
			}

			await stripe.invoices.sendInvoice(stripeInvoice.id);

			// Retrieve invoice from stripe
			const stripeInvoiceData = await stripe.invoices.retrieve(
				stripeInvoice.id
			);

			const stripeData = {
				...stripeInvoiceData,
				items: stripeInvoiceItems,
			};

			domain.stripeData = stripeData;

			// Create new invoice

			const newDomain = new Domain(domain);
			await newDomain.save();

			const invoice = new Invoice({
				client: client._id,
				domain: newDomain._id,
				totalAmount: domain.totalPrice,
				planType: client.planType._id,
				_for: 'domain',
				status: 'pending',
				stripeData,
			});
			await invoice.save();
		}

		return domain;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateDomain = async (id: string, domain: any) => {
	try {
		/*const { error } = validateDomain(domain);
		if (error) {
			throw error;
		}*/

		const updatedDomain = await Domain.findOneAndUpdate(
			{
				_id: id,
				domain,
			},
			domain,
			{ new: true }
		);
		return updatedDomain;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteDomain = async (id: string) => {
	try {
		const deletedDomain = await Domain.findOneAndDelete({
			_id: id,
		});
		return deletedDomain;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getDomains,
	getDomainById,
	createDomain,
	updateDomain,
	deleteDomain,
};
