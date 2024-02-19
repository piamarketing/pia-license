// @tss-nocheck
import Product from '@/server/models/Product';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const getProducts = async () => {
	try {
		const products = await Product.find({});
		return products;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getProductById = async (id: string) => {
	try {
		const product = await Product.findOne({
			_id: id,
		});
		return product;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createProduct = async (product: any) => {
	try {
		/*const { error } = validateProduct(product);
		if (error) {
			throw error;
		}*/

		// create new stripe product
		const stripeProduct = await stripe.products.create({
			name: product.name,
		});

		// create new stripe price

		const stripePrice = await stripe.prices.create({
			product: stripeProduct.id,
			unit_amount: product.price * 100,
			currency: 'eur',
		});

		product.stripeData = {
			product: stripeProduct,
			price: stripePrice,
		};

		const newProduct = new Product(product);

		await newProduct.save();

		return newProduct;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateProduct = async (id: string, product: any) => {
	try {
		/*const { error } = validateProduct(product);
		if (error) {
			throw error;
		}*/

		const priceR = parseInt(parseFloat(product.price || 0).toFixed(2) * 100);

		const productData = await Product.findOne({
			_id: id,
		});

		// update stripe product
		await stripe.products.update(productData.stripeData.product.id, {
			name: product.name,
		});

		// Create stripe price
		const stripePrice = await stripe.prices.create({
			product: productData.stripeData.product.id,
			unit_amount: priceR,
			currency: 'eur',
		});

		product.stripeData = {
			...productData.stripeData,
			price: {
				...stripePrice,
			},
		};

		console.log(product);

		const updatedProduct = await Product.findOneAndUpdate(
			{
				_id: id,
			},
			product,
			{ new: true }
		);
		return updatedProduct;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteProduct = async (id: string) => {
	try {
		const deletedProduct = await Product.findOneAndDelete({
			_id: id,
		});
		return deletedProduct;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
