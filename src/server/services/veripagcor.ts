import connection from '@/server/lib/mysql';

export const getClientList = async () => {
	const clients = await new Promise((resolve, reject) => {
		connection.query('SELECT * FROM clients', (err, results) => {
			if (err) {
				reject(err);
			}
			resolve(results);
		});
	});
	return clients;
};

export const getClientsDomains = async (website = '') => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'SELECT domain, mobile_domain FROM clients WHERE website = ?',
			[website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const getClient = async (website = '') => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'SELECT * FROM clients WHERE website = ?',
			[website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const updateDomains = async (
	website = '',
	domain = '',
	mobileDomain = ''
) => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'UPDATE clients SET domain = ?, mobile_domain = ? WHERE website = ?',
			[domain, mobileDomain, website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const updateCompanyName = async (website = '', companyName = '') => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'UPDATE clients SET company = ? WHERE website = ?',
			[companyName, website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const updateStatus = async (website = '', status = 0) => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'UPDATE clients SET status = ? WHERE website = ?',
			[status, website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const updateIsProvider = async (website = '', isProvider = 0) => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'UPDATE clients SET is_provider_mode = ? WHERE website = ?',
			[isProvider, website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const updateLicense = async (
	website = '',
	licenseStartedAt = '',
	licenseEndedAt = ''
) => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'UPDATE clients SET license_start = ?, license_end = ? WHERE website = ?',
			[licenseStartedAt, licenseEndedAt, website],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export const createClient = async (
	website = '',
	domain = '',
	mobileDomain = '',
	companyName = '',
	companyAddress = '',
	email = '',
	status = 0,
	isProvider = 0,
	licenseStartedAt = '',
	licenseEndedAt = ''
) => {
	const domains = await new Promise((resolve, reject) => {
		connection.query(
			'INSERT INTO clients (website, domain, mobile_domain, company, address, email, status, is_provider_mode, license_start, license_end, is_generate_certificate, created_at, updated_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
			[
				website,
				domain,
				mobileDomain,
				companyName,
				companyAddress,
				email,
				status,
				isProvider,
				licenseStartedAt,
				licenseEndedAt,
				1,
			],
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
	return domains;
};

export default {
	getClientList,
	getClientsDomains,
	getClient,
	updateDomains,
	updateCompanyName,
	updateStatus,
	updateIsProvider,
	updateLicense,
	createClient,
};
