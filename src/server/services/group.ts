// @tss-nocheck
import Group from '@/server/models/Group';

export const getGroups = async () => {
	try {
		const groups = await Group.find({});
		return groups;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getGroupById = async (id: string) => {
	try {
		const group = await Group.findOne({
			_id: id,
		});
		return group;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createGroup = async (group: any) => {
	try {
		/*const { error } = validateGroup(group);
		if (error) {
			throw error;
		}*/

		const newGroup = new Group(group);
		await newGroup.save();

		return newGroup;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateGroup = async (id: string, group: any) => {
	try {
		/*const { error } = validateGroup(group);
		if (error) {
			throw error;
		}*/

		const updatedGroup = await Group.findOneAndUpdate(
			{
				_id: id,
				group,
			},
			group,
			{ new: true }
		);
		return updatedGroup;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteGroup = async (id: string) => {
	try {
		const deletedGroup = await Group.findOneAndDelete({
			_id: id,
		});
		return deletedGroup;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getGroups,
	getGroupById,
	createGroup,
	updateGroup,
	deleteGroup,
};
