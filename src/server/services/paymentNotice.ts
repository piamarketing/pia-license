import Invoice from '../models/Invoice';
import PaymentNotice from '@/server/models/PaymentNotice';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import crypto from 'crypto';
import Domain from '../models/Domain';
import Client from '../models/Client';
import Plan from '../models/Plan';

export const getPaymentNotices = async (session?: any) => {
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
		const paymentNotices = await PaymentNotice.find({
			...adfilters.normal,
		})
			.populate('client')
			.populate('invoice');
		return paymentNotices;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getPaymentNoticeById = async (id: string) => {
	try {
		const paymentNotice = await PaymentNotice.findOne({
			_id: id,
		}).populate('client');
		return paymentNotice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createPaymentNotice = async (
	paymentNotice: any,
	session?: any
) => {
	try {
		/*const { error } = validatePaymentNotice(paymentNotice);
		if (error) {
			throw error;
		}*/
		paymentNotice.client = session.client._id;
		const newPaymentNotice = new PaymentNotice(paymentNotice);
		await newPaymentNotice.save();

		return newPaymentNotice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updatePaymentNotice = async (id: string, paymentNotice: any) => {
	try {
		/*const { error } = validatePaymentNotice(paymentNotice);
		if (error) {
			throw error;
		}*/
		const paymentNoticeData = await PaymentNotice.findOne({
			_id: id,
		});

		if (!paymentNoticeData) {
			throw new Error('Payment notice not found');
		}

		if (paymentNotice.status === 'approved') {
			const invoiceData = await Invoice.findOne({
				_id: paymentNoticeData.invoice,
			});
			if (!invoiceData) {
				throw new Error('Invoice not found');
			}

			const clientData = await Client.findOne({
				_id: invoiceData.client,
			}).populate('planType');

			const planData = await Plan.findOne({
				_id: clientData.planType._id,
			}).populate('products');

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
						paymentNotice: paymentNoticeData._id,
						paidAt: new Date(),
					},
				}
			);
		}

		const updatedPaymentNotice = await PaymentNotice.findOneAndUpdate(
			{
				_id: id,
			},
			paymentNotice,
			{ new: true }
		);
		return updatedPaymentNotice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deletePaymentNotice = async (id: string) => {
	try {
		const deletedPaymentNotice = await PaymentNotice.findOneAndDelete({
			_id: id,
		});
		return deletedPaymentNotice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getPaymentNotices,
	getPaymentNoticeById,
	createPaymentNotice,
	updatePaymentNotice,
	deletePaymentNotice,
};
