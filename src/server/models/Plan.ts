import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema(
	{
		name: String,
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		domainPrice: Number,
		domainStripeData: Object,
	},
	{ timestamps: true }
);

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
