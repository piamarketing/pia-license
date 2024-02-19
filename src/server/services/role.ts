// @tss-nocheck
import Role from '@/server/models/Role';

export const getRoles = async (session: any) => {
	try {
		const roles = await Role.find({});
		return roles;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getRoleById = async (id: string, session: any) => {
	try {
		const role = await Role.findOne({
			_id: id,
		});
		return role;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createRole = async (role: any, session: any) => {
	try {
		console.log(session);
		/*const { error } = validateRole(role);
		if (error) {
			throw error;
		}*/
		const newRole = new Role(role);
		await newRole.save();

		return newRole;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateRole = async (id: string, role: any, session: any) => {
	try {
		/*const { error } = validateRole(role);
		if (error) {
			throw error;
		}*/

		const updatedRole = await Role.findOneAndUpdate(
			{
				_id: id,
			},
			role,
			{ new: true }
		);
		return updatedRole;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteRole = async (id: string, session: any) => {
	try {
		const deletedRole = await Role.findOneAndDelete({
			_id: id,
		});
		return deletedRole;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getRoles,
	getRoleById,
	createRole,
	updateRole,
	deleteRole,
};
