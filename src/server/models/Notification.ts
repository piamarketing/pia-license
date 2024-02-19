import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
	{
		title: String,
		body: String,
	},
	{ timestamps: true }
);

export default mongoose.models.Notification ||
	mongoose.model('Notification', NotificationSchema);
