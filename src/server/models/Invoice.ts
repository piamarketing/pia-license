import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema(
	{
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		stripeData: Object,
		totalAmount: Number,
		hid: String,
		paymentNotice: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PaymentNotice',
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		domain: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Domain',
		},
		planType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Plan',
		},
		_for: {
			type: String,
		},
		forPlan: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: ['pending', 'paid'],
			default: 'pending',
		},
		paidAt: Date,
		dueDate: Date,
	},
	{ timestamps: true }
);

export default mongoose.models.Invoice ||
	mongoose.model('Invoice', InvoiceSchema);
