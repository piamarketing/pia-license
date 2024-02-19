import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
	{
		ticketId: {
			type: Number,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
		},
		category: String,
		subject: String,
		messages: [
			{
				from: {
					type: String,
					enum: ['client', 'admin'],
				},
				message: String,
				createdAt: Date,
			},
		],
		status: {
			type: String,
			enum: ['open', 'closed', 'pending-reply'],
			default: 'open',
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
