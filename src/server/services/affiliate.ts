// @tss-nocheck
import bcrypt from 'bcrypt';
import Affiliate from '@/server/models/User';
// import { authenticator } from 'otplib';

export const getAffiliates = async () => {
	try {
		// Calculate total players witht affilliates btag and as totalPlayers
		const affiliates = await Affiliate.aggregate([
			{
				$match: {
					type: 'affiliate',
				},
			},
			{
				$lookup: {
					from: 'players',
					localField: 'btag',
					foreignField: 'btag',
					as: 'players',
				},
			},
			{
				$lookup: {
					from: 'activities',
					localField: '_id',
					foreignField: 'affiliate',
					as: 'activities',
				},
			},
			{
				$lookup: {
					from: 'groups',
					localField: 'group',
					foreignField: '_id',
					as: 'group',
				},
			},
			{
				$project: {
					_id: 1,
					nameSurname: 1,
					type: 1,
					email: 1,
					btag: 1,
					createdAt: 1,
					isEnabled: 1,
					balance: 1,
					group: 1,
					totalPlayers: { $size: '$players' },
					totalPlayerDeposits: {
						$sum: '$players.deposit.total',
					},
					totalPlayerWithdrawals: {
						$sum: '$players.withdrawal.total',
					},
					totalActivities: {
						$sum: '$activities.amount',
					},
				},
			},
		]);

		return affiliates;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getAffiliateById = async (id: string) => {
	try {
		const affiliate = await Affiliate.findOne({
			_id: id,
			type: 'affiliate',
		});

		return affiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createAffiliate = async (affiliate: any) => {
	try {
		/*const { error } = validateAffiliate(affiliate);
		if (error) {
			throw error;
		}*/

		const existingAffiliate = await Affiliate.findOne({
			email: affiliate.email,
		});
		if (existingAffiliate) {
			throw new Error('Affiliate already exists');
		}

		affiliate.password = await bcrypt.hash(affiliate.password, 10);
		affiliate.type = 'affiliate';
		affiliate.isSuperAdmin = false;
		affiliate.btag = Math.floor(1000000 + Math.random() * 9000000);

		const newAffiliate = new Affiliate(affiliate);
		await newAffiliate.save();

		return newAffiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateAffiliate = async (id: string, affiliate: any) => {
	try {
		/*const { error } = validateAffiliate(affiliate);
		if (error) {
			throw error;
		}*/

		const updatedAffiliate = await Affiliate.findOneAndUpdate(
			{
				_id: id,
				type: 'affiliate',
			},
			affiliate,
			{ new: true }
		);
		return updatedAffiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteAffiliate = async (id: string) => {
	try {
		const deletedAffiliate = await Affiliate.findOneAndDelete({
			_id: id,
			type: 'affiliate',
		});
		return deletedAffiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const resetPassword = async (id: string, password: string) => {
	try {
		const updatedAffiliate = await Affiliate.findOneAndUpdate(
			{
				_id: id,
				type: 'affiliate',
			},
			{
				$set: {
					password: await bcrypt.hash(password, 10),
				},
			},
			{ new: true }
		);

		return updatedAffiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const changeIsActive = async (id: string, isActive: boolean) => {
	try {
		const updatedAffiliate = await Affiliate.findOneAndUpdate(
			{
				_id: id,
				type: 'affiliate',
			},
			{
				$set: {
					isActive,
				},
			},
			{ new: true }
		);

		return updatedAffiliate;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getAffiliates,
	getAffiliateById,
	createAffiliate,
	updateAffiliate,
	deleteAffiliate,
	changeIsActive,
	resetPassword,
};
