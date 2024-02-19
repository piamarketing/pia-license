import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		billingItems: Array,
		planType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Plan',
		},
		phone: {
			type: String,
		},
		masterCompany: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
		},
		subCompany: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
		},
		skype: String,
		website: {
			type: String,
			unique: true,
		},
		gamingProvider: String,
		company: String,
		companyCode: String,
		country: String,
		address: {
			type: String,
		},
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		contactEmail: {
			type: String,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isProvider: {
			type: Boolean,
			default: false,
		},
		license: {
			validUntil: {
				type: Date,
				default: Date.now,
			},
			startedAt: {
				type: Date,
				default: Date.now,
			},
			isActive: {
				type: Boolean,
				default: false,
			},
			isDomainsFree: {
				type: Boolean,
				default: false,
			},
		},
		services: Object,
		activatonStartedAt: Date,
		docs: Array,
		revisedProducts: Array,
		revisedDomainPrice: Number,
		revisedDomainStripeData: Object,
		stripeCustomer: Object,
		lastSyncedAt: Date,
		domains: Array,
		telegramBotToken: String,
		telegramChatId: String,
	},
	{ timestamps: true }
);

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
