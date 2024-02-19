import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
	{
		name: String,
		type: {
			type: String,
			enum: ['master', 'sub'],
		},
		address: String,
		email: String,
		contact: String,
		licenseNumber: String,
	},
	{ timestamps: true }
);

export default mongoose.models.Company ||
	mongoose.model('Company', CompanySchema);
