import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		email: String,
		password: String,
		nameSurname: String,
		type: String,
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
		},
		group: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		isEnabled: Boolean,
		isSuperAdmin: Boolean,
		balance: Number,
		isActingAsClient: Boolean,
		actAsClient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		isMultiaccessing: Boolean,
		multiaccess: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		multiaccessClients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Client',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
