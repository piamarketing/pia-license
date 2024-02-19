import mongoose from 'mongoose';

const PaymentNoticeSchema = new mongoose.Schema(
	{
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		invoice: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Invoice',
		},
		paymentMethod: {
			type: String,
			enum: ['cash', 'banktransfer', 'crypto'],
		},
		paymentAccount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PaymentAccount',
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		paymentProof: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.PaymentNotice ||
	mongoose.model('PaymentNotice', PaymentNoticeSchema);
