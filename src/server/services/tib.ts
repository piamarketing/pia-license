import axios from 'axios';
import Client from '@/server/models/Client';
import Tib from '@/server/models/Tib';
const HttpsProxyAgent = require('https-proxy-agent');

export const getTibs = async (session?: any) => {
	try {
		const adfilters =
			session?.type === 'client'
				? {
						normal: { client: session.client._id },
						aggregate: { $match: { client: session.client._id } },
				  }
				: {
						normal: {},
						aggregate: {
							$match: {
								_id: {
									$ne: null,
								},
							},
						},
				  };
		const tibs = await Tib.find({
			...adfilters.normal,
		}).populate('client');
		return tibs;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getTibById = async (id: string) => {
	try {
		const tib = await Tib.findOne({
			_id: id,
		});
		return tib;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createTib = async (tib: any, session?: any) => {
	try {
		/*const { error } = validateTib(tib);
		if (error) {
			throw error;
		}*/

		const newTib = new Tib(tib);
		await newTib.save();

		return newTib;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateTib = async (id: string, tib: any) => {
	try {
		/*const { error } = validateTib(tib);
		if (error) {
			throw error;
		}*/
		const updatedTib = await Tib.findOneAndUpdate(
			{
				_id: id,
			},
			tib,
			{ new: true }
		);
		return updatedTib;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteTib = async (id: string) => {
	try {
		const deletedTib = await Tib.findOneAndDelete({
			_id: id,
		});
		return deletedTib;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const checkTib = async (tib: any) => {
	let status = 'checking';

	if (!tib) {
		throw new Error('Tib not found');
	}
	const website = 'https://' + tib?.domain;
	const client = tib?.client;

	const proxy0 = {
		hostname: '194.87.139.112',
		port: 12323,
		auth: '14a66a8a4d466:92f908f1db',
	};
	const agent0 = new HttpsProxyAgent(proxy0);

	const proxy = {
		hostname: '194.62.54.216',
		port: 8080,
		auth: 'govercinweb@gmail.com:1Qaz2wsxcc',
	};
	const agent = new HttpsProxyAgent(proxy);

	try {
		const source = axios.CancelToken.source();
		let response: any = null;
		setTimeout(() => {
			if (response === null) {
				source.cancel();
			}
		}, 10000);
		response = await axios.head(website, {
			cancelToken: source.token,
			httpsAgent: agent0,
		});
		if (response.status === 200) {
			status = 'ok';
			console.log('okk');
		}
	} catch (err: any) {
		console.log(website + 'Error:', err);

		if (
			err.response &&
			(err.response?.status === 301 || err.response?.status === 302)
		) {
			status = 'redirected';

			console.log('saving to db redirected ' + website);
		} else {
			status = 'not-reachable';

			console.log('saving to db not-reachable ' + website);
		}
		return {
			status,
			tib,
		};
	}

	try {
		const source = axios.CancelToken.source();
		let response: any = null;
		setTimeout(() => {
			if (response === null) {
				source.cancel();
			}
		}, 15000);

		response = await axios.get(website, {
			maxRedirects: 0,
			httpsAgent: agent,
			cancelToken: source.token,
		});

		if (response.status === 200) {
			if (
				response.data.includes('Telekomünikasyon İletişim Başkanlığı') ||
				response.data.includes('5651 Sayılı')
			) {
				console.log('TIB');
				status = 'blocked';
			} else {
				status = 'active';
			}
		}
	} catch (err: any) {
		console.log(err);
		console.log(err.message);
		status = 'blocked';
	}

	// Save the result to the database

	console.log('saving to db ' + status + ' ' + website);

	if (status === 'blocked') {
		console.log('trying to send message');
		const telegramMessage = `
				<b>Website blocked by TIB:</b> ${tib.domain}
				`;
		const client = tib.client;
		if (client.telegramBotToken && client.telegramChatId) {
			await axios.post(
				`https://api.telegram.org/bot${client.telegramBotToken}/sendMessage?chat_id=${client.telegramChatId}&parse_mode=HTML&text=${telegramMessage}`
			);
		}
		console.log('TELEGRAM MESSAGE SENDINGUNU ' + client.telegramBotToken);
	}

	return {
		status,
		tib,
	};
};

const checkTibs = async () => {
	const tibs = await Tib.find({
		status: {
			$nin: ['blocked', 'redirected'],
		},
	}).populate('client');

	console.log(tibs.length);
	const promises = tibs.map(async (tib) => {
		return checkTib(tib);
	});

	const result = await Promise.all(promises);

	// Send telegram messages

	/*
	 Format is like this:
	 [
		 {	
			 status: 'ok',
			 tib: {
				...
			 }	
		 },
		 {
			 status: 'not-reachable',
			 tib: {
				...
			 }
		 }
	 ]
	 */
	// We need to bulk update the tibs
	const bulk = await Tib.collection.bulkWrite(
		result.map((item) => {
			return {
				updateOne: {
					filter: { _id: item.tib._id },
					update: { $set: { status: item.status } },
				},
			};
		})
	);

	return result;
};

export default {
	checkTib,
	checkTibs,
	createTib,
	deleteTib,
	getTibById,
	getTibs,
	updateTib,
};
