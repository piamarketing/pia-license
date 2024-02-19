// @tss-nocheck
import Invoice from '@/server/models/Invoice';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import crypto from 'crypto';
import Client from '../models/Client';
import Product from '../models/Product';
import moment from 'moment';

export const getInvoices = async (session?: any) => {
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
	console.log(adfilters);
	try {
		const invoices = await Invoice.find({
			...adfilters.normal,
		}).populate('client');
		return invoices;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getInvoiceById = async (id: string) => {
	try {
		const invoice = await Invoice.findOne({
			_id: id,
		}).populate('client');
		return invoice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createInvoice = async (invoice: any) => {
	try {
		/*const { error } = validateInvoice(invoice);
		if (error) {
			throw error;
		}*/

		const newInvoice = new Invoice(invoice);
		await newInvoice.save();

		return newInvoice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateInvoice = async (id: string, invoice: any) => {
	try {
		/*const { error } = validateInvoice(invoice);
		if (error) {
			throw error;
		}*/

		const updatedInvoice = await Invoice.findOneAndUpdate(
			{
				_id: id,
				invoice,
			},
			invoice,
			{ new: true }
		);
		return updatedInvoice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteInvoice = async (id: string) => {
	try {
		const deletedInvoice = await Invoice.findOneAndDelete({
			_id: id,
		});
		return deletedInvoice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createInvoicesForClients = async () => {
	try {
		// Add 5 days to the current date
		const date = new Date();

		const day = date.getUTCDate();
		const month = date.getUTCMonth() + 1;
		const year = date.getUTCFullYear();

		const clients = await Client.find({});

		// First get all the clients with billingItems
		const clientsWithBillingItems = clients.filter(
			(client) => client.billingItems.length > 0
		);

		// Get all unique products productsItems.product
		const productsList = clientsWithBillingItems
			.map((client) => client.billingItems)
			.flat()
			.map((item) => item.product)
			.filter((value, index, self) => self.indexOf(value) === index);

		// Find products and map with _id
		const productsTemp = await Product.find({
			_id: {
				$in: productsList,
			},
		})

		const products = productsTemp.reduce((acc, product) => {
			acc[product._id] = product;
			return acc;
		}, {});

		
		for(const client of clientsWithBillingItems) {
			const billingItems = client.billingItems.map((item:any) => {
				const period = item.period;
				let diff = period - day;

				const daysInMonth = new Date(year, month, 0).getUTCDate();
				if(diff < 0) {
					diff = daysInMonth + diff + 1;
				}

				// Difference shold be between 0 and 5
				if(diff < 0 || diff > 6) {
					return;
				}

			
				const calculatedDueDate = new Date()
				calculatedDueDate.setDate(calculatedDueDate.getUTCDate() + diff);
				console.log(calculatedDueDate);
				return {
					...item,
					period,
					diff,
					dueDate: calculatedDueDate,
					hid: `${item.period}-${month}-${year}`,
					productData: products[item.product],
				}

			}).filter((item:any) => item !== undefined);

			const billingHids = billingItems.map((item:any) => item.hid);

			const existingInvoices = await Invoice.find({
				client: client._id,
				hid: {
					$in: billingHids,
				}
			});

			// Remove existing invoices
			const filteredBillingItems = billingItems.filter((item:any) => {
				return !existingInvoices.find((invoice:any) => invoice.hid === item.hid);
			});


			// Create invoices
			
			for(const bitem of filteredBillingItems) {
				
				const stripeInvoice = await stripe.invoices.create({
					customer: client.stripeCustomer.id,
					collection_method: 'send_invoice',
					days_until_due: bitem.diff
				});
				const stripeProduct = await stripe.invoiceItems.create({
					invoice: stripeInvoice.id,
					price: bitem.revisedPrice ? bitem.revisedStripeData.id : bitem.productData.stripeData.price.id,
					customer: client.stripeCustomer.id
				});

				await stripe.invoices.sendInvoice(stripeInvoice.id);

				// Retrieve invoice from stripe
				const stripeInvoiceData = await stripe.invoices.retrieve(stripeInvoice.id);

				const stripeData = {
					...stripeInvoiceData,
					items: [stripeProduct],
				};
				console.log(stripeData);

				const invoice = new Invoice({
					client: client._id,
					totalAmount: bitem.revisedPrice || bitem.productData.price,
					_for: bitem.productData.service || 'none',
					products: [bitem.productData._id],
					forPlan: false,
					status: 'pending',
					hid: bitem.hid,
					dueDate: bitem.dueDate,
					stripeData,
				});

				await invoice.save();

				console.log(invoice);
			}

		}

	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getInvoices,
	getInvoiceById,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	createInvoicesForClients,
};
