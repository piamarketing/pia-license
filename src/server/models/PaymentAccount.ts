import mongoose from 'mongoose';

const PaymentAccountSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['banktransfer', 'crypto', 'papara', 'wise'],
		},
		name: {
			type: String,
		},
		iban: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.PaymentAccount ||
	mongoose.model('PaymentAccount', PaymentAccountSchema);
