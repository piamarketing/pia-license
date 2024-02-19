// @tss-nocheck
import Client from '../models/Client';
import User from '../models/User';
import bcrypt from 'bcrypt';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async function createApplication(application: any) {
	try {
		const {
			planType,
			website,
			email,
			password,
			phone,
			skype,
			telegram,
			company,
			provider,
			companyCode,
			country,
			address,
			firstName,
			lastName,
			contactEmail,
			passport,
			additionalInfo,
		} = application;
		// First check if email is already registered

		const user = await User.findOne({ email });
		if (user) {
			throw new Error('User already exists');
		}

		const docs = [
			{
				docName: 'passport',
				docUrl: passport,
			},
			{
				docName: 'additionalInfo',
				docUrl: additionalInfo,
			},
		];

		// create new stripe customer
		const customer = await stripe.customers.create({
			name: firstName + ' ' + lastName,
			email: contactEmail,
		});

		// Create client
		const client = await Client.create({
			planType,
			website,
			phone,
			skype,
			telegram,
			company,
			gamingProvider: provider,
			companyCode,
			country,
			address,
			firstName,
			lastName,
			contactEmail,
			docs,
			stripeCustomer: customer,
		});

		// Create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			client: client._id,
			type: 'client',
		});

		return newUser;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
