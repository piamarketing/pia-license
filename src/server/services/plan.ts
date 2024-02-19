// @tss-nocheck
import Plan from '@/server/models/Plan';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const getPlans = async () => {
	try {
		const plans = await Plan.find({});
		return plans;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getPlanById = async (id: string) => {
	try {
		const plan = await Plan.findOne({
			_id: id,
		});
		return plan;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createPlan = async (plan: any) => {
	try {
		/*const { error } = validatePlan(plan);
		if (error) {
			throw error;
		}*/
		const priceR = parseInt(parseFloat(plan.domainPrice || 0).toFixed(2) * 100);
		// create new stripe product for domain
		const stripeProduct = await stripe.products.create({
			name: plan.name + ' domain',
		});

		// create new stripe price for domain
		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: priceR,
			currency: 'eur',
		});

		plan.domainStripeData = {
			product: stripeProduct,
			price: stripePrice,
		};

		console.log(plan);
		const newPlan = new Plan(plan);
		await newPlan.save();

		return newPlan;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updatePlan = async (id: string, plan: any) => {
	try {
		/*const { error } = validatePlan(plan);
		if (error) {
			throw error;
		}*/

		const planData = await Plan.findOne({
			_id: id,
		});

		const priceR = parseInt(parseFloat(plan.domainPrice || 0).toFixed(2) * 100);

		const stripePrice = await stripe.prices.create({
			product: planData.domainStripeData.product.id,
			unit_amount: priceR,
			currency: 'eur',
		});

		plan.domainStripeData = {
			...planData.domainStripeData,
			price: stripePrice,
		};

		const updatedPlan = await Plan.findOneAndUpdate(
			{
				_id: id,
			},
			plan,
			{ new: true }
		);
		return updatedPlan;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deletePlan = async (id: string) => {
	try {
		const deletedPlan = await Plan.findOneAndDelete({
			_id: id,
		});
		return deletedPlan;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getPlans,
	getPlanById,
	createPlan,
	updatePlan,
	deletePlan,
};
