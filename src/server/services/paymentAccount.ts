// @tss-nocheck
import PaymentAccount from '@/server/models/PaymentAccount';

export const getPaymentAccounts = async () => {
	try {
		const paymentAccounts = await PaymentAccount.find({});
		return paymentAccounts;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getPaymentAccountById = async (id: string) => {
	try {
		const paymentAccount = await PaymentAccount.findOne({
			_id: id,
		});
		return paymentAccount;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createPaymentAccount = async (paymentAccount: any) => {
	try {
		/*const { error } = validatePaymentAccount(paymentAccount);
		if (error) {
			throw error;
		}*/

		const newPaymentAccount = new PaymentAccount(paymentAccount);
		await newPaymentAccount.save();

		return newPaymentAccount;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updatePaymentAccount = async (id: string, paymentAccount: any) => {
	try {
		/*const { error } = validatePaymentAccount(paymentAccount);
		if (error) {
			throw error;
		}*/

		const updatedPaymentAccount = await PaymentAccount.findOneAndUpdate(
			{
				_id: id,
				paymentAccount,
			},
			paymentAccount,
			{ new: true }
		);
		return updatedPaymentAccount;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deletePaymentAccount = async (id: string) => {
	try {
		const deletedPaymentAccount = await PaymentAccount.findOneAndDelete({
			_id: id,
		});
		return deletedPaymentAccount;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getPaymentAccounts,
	getPaymentAccountById,
	createPaymentAccount,
	updatePaymentAccount,
	deletePaymentAccount,
};
