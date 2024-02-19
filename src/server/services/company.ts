// @tss-nocheck
import Company from '@/server/models/Company';

export const getCompanies = async () => {
	try {
		const companies = await Company.find({});
		return companies;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getCompanyById = async (id: string) => {
	try {
		const company = await Company.findOne({
			_id: id,
		});
		return company;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createCompany = async (company: any) => {
	try {
		/*const { error } = validateCompany(company);
		if (error) {
			throw error;
		}*/

		const newCompany = new Company(company);
		await newCompany.save();

		return newCompany;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateCompany = async (id: string, company: any) => {
	try {
		/*const { error } = validateCompany(company);
		if (error) {
			throw error;
		}*/
		const updatedCompany = await Company.findOneAndUpdate(
			{
				_id: id,
			},
			company,
			{ new: true }
		);
		return updatedCompany;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteCompany = async (id: string) => {
	try {
		const deletedCompany = await Company.findOneAndDelete({
			_id: id,
		});
		return deletedCompany;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getCompanies,
	getCompanyById,
	createCompany,
	updateCompany,
	deleteCompany,
};
