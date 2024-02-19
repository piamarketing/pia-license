import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		type: String,
		duration: Number,
		price: Number,
		giveFreeDomains: Boolean,
		isAffectingLicense: Boolean,
		stripeData: Object,
		service: String,
	},
	{ timestamps: true }
);

export default mongoose.models.Product ||
	mongoose.model('Product', ProductSchema);
