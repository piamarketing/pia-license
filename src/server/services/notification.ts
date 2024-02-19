// @tss-nocheck
import Notification from '@/server/models/Notification';

export const getNotifications = async () => {
	try {
		const notifications = await Notification.find({});
		return notifications;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getNotificationById = async (id: string) => {
	try {
		console.log(id);
		const notification = await Notification.findById(id);
		console.log(notification);
		return notification;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createNotification = async (notification: any) => {
	try {
		/*const { error } = validateNotification(notification);
		if (error) {
			throw error;
		}*/

		const newNotification = new Notification(notification);
		await newNotification.save();

		return newNotification;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateNotification = async (id: string, notification: any) => {
	try {
		/*const { error } = validateNotification(notification);
		if (error) {
			throw error;
		}*/

		const updatedNotification = await Notification.findOneAndUpdate(
			{
				_id: id,
			},
			notification,
			{ new: true }
		);
		return updatedNotification;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteNotification = async (id: string) => {
	try {
		const deletedNotification = await Notification.findOneAndDelete({
			_id: id,
		});
		return deletedNotification;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getNotifications,
	getNotificationById,
	createNotification,
	updateNotification,
	deleteNotification,
};
