import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
	{
		name: String,
		rate: Number,
		merchant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Merchant',
		},
		isEnabled: Boolean,
	},
	{ timestamps: true }
);

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
