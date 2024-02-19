import axios from 'axios';

export const ENDPOINTS = {
	auth: '/auth',
	auth_login: '/auth/login',
	groups: '/groups',
	roles: '/roles',
	users: '/users',
	players: '/players',
	reports: '/reports',
	products: '/products',
	invoices: '/invoices',
	clients: '/clients',
	clients_sync: '/clients/sync',
	clients_approve: '/clients/approve',
	plans: '/plans',
	domains: '/domains',
	application: '/application',
	companies: '/companies',
	tickets: '/tickets',
	paymentNotices: '/paymentNotices',
	notifications: '/notifications',
	paymentAccounts: '/paymentAccounts',
	tibs: '/tibs',
};

const API = axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:9999/api'
			: 'https://licenses.piaport.com/api',
});

export default API;
