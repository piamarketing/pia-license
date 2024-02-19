// @ts-nocheck
import '../models/User';
import '../models/Role';
import '../models/Group';
import '../models/Invoice';
import '../models/Client';
import '../models/Product';
import '../models/Plan';
import '../models/Company';
import mongoose from 'mongoose';

const MONGODB_CONNECTOR = process.env.MONGODB_ATLAS_CONNECTOR;

if (!MONGODB_CONNECTOR) {
	throw new Error('Connector not found');
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};

		cached.promise = mongoose
			.connect(MONGODB_CONNECTOR, opts)
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export default dbConnect;
