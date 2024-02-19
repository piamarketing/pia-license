import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema(
	{
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		domains: Array,
		totalPrice: Number,
		stripeData: Object,
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Domain || mongoose.model('Domain', DomainSchema);
