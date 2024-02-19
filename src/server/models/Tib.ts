import mongoose from 'mongoose';

const TibSchema = new mongoose.Schema(
	{
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		domain: String,
		status: {
			type: String,
			default: 'active',
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Tib || mongoose.model('Tib', TibSchema);
