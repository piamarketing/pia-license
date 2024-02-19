// @tss-nocheck
import bcrypt from 'bcrypt';
import User from '@/server/models/User';
import Client from '../models/Client';
// import { authenticator } from 'otplib';

export const getUsers = async () => {
	try {
		const users = await User.find({
			type: 'admin',
		}).populate('role');
		return users;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getUserByClient = async (id: string) => {
	try {
		const user = await User.findOne({
			client: id,
			isSuperAdmin: undefined,
			isSuperadmin: undefined,
		});

		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await User.findOne({
			_id: id,
		})
			.populate('role')
			.populate('group');
		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createUser = async (user: any) => {
	try {
		/*const { error } = validateUser(user);
		if (error) {
			throw error;
		}*/

		const existingUser = await User.findOne({ email: user.email });
		if (existingUser) {
			throw new Error('User already exists');
		}

		user.password = await bcrypt.hash(user.password, 10);
		user.type = 'admin';

		const newUser = new User(user);
		await newUser.save();

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createUserForClient = async (user: any, client: any) => {
	try {
		/*const { error } = validateUser(user);
		if (error) {
			throw error;
		}*/

		const userData = await User.findOne({
			client: client,
			isSuperAdmin: undefined,
			isSuperadmin: undefined,
		});
		if (userData) {
			// Update user
			let sett = {
				email: user.email,
				type: 'client',
				multiaccessClients: user.multiaccessClients,
			};
			if (user.password) {
				sett.password = await bcrypt.hash(user.password, 10);
			}
			const updatedUser = await User.findOneAndUpdate(
				{
					client: client,
					isSuperAdmin: undefined,
					isSuperadmin: undefined,
				},
				{
					$set: sett,
				}
			);
			return updatedUser;
		} else {
			user.client = client;
			user.type = 'client';
			if (user.password) {
				user.password = await bcrypt.hash(user.password, 10);
			} else {
				delete user.password;
			}
			const newUser = new User(user);
			return newUser.save();
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateUser = async (id: string, user: any) => {
	try {
		/*const { error } = validateUser(user);
		if (error) {
			throw error;
		}*/

		const updatedUser = await User.findOneAndUpdate(
			{
				_id: id,
			},
			user,
			{ new: true }
		);
		return updatedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteUser = async (id: string) => {
	try {
		const deletedUser = await User.findOneAndDelete({
			_id: id,
		});
		return deletedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const resetPassword = async (id: string, password: string) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					password: await bcrypt.hash(password, 10),
				},
			},
			{ new: true }
		);

		return updatedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const changeIsActive = async (id: string, isActive: boolean) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					isActive,
				},
			},
			{ new: true }
		);

		return updatedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const toggleActing = async (id: string, session: any) => {
	try {
		if (id) {
			const user = await User.findOneAndUpdate(
				{
					email: session?.email,
				},
				{
					$set: {
						isActingAsClient: true,
						actAsClient: id,
					},
				},
				{ new: true }
			);

			return user;
		} else {
			console.log(session);
			const user = await User.findOneAndUpdate(
				{
					email: session?.email,
				},
				{
					$set: {
						isActingAsClient: false,
						actAsClient: null,
					},
				},
				{ new: true }
			);

			return user;
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const changeClient = async (id: string, website: string) => {
	try {
		console.log(id, website);
		const client = await Client.findOne({
			website,
		});

		if (!client) {
			throw new Error('Client not found');
		}

		const updatedUser = await User.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					client: client._id,
				},
			},
			{ new: true }
		);

		return updatedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

		

export default {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	changeIsActive,
	resetPassword,
	toggleActing,
	getUserByClient,
	createUserForClient,
	changeClient,
};
