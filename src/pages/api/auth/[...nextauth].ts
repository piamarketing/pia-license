import dbConnect from '@/server/lib/db';
import NextAuth from 'next-auth';
import User from '@/server/models/User';
import Group from '@/server/models/Group';
import Credentials from 'next-auth/providers/credentials';
import API, { ENDPOINTS } from '@/lib/API';
import Cookies from 'js-cookie';
import Plan from '@/server/models/Plan';
import Client from '@/server/models/Client';

export const options = {
	secret: 'H209ds2KJ',
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'EMail', type: 'text', placeholder: 'Email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials: any) {
				try {
					const { email, password } = credentials;

					await dbConnect();
					const res = await API.post(ENDPOINTS.auth_login, {
						email,
						password,
					});
					console.log(res.data.data);
					return res.data.data;
				} catch (error: any) {
					console.log(error);
					throw new Error(error.response.data.error || error.message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (token) {
				await dbConnect();
				const userData = await User.findOne({ email: token.email }).populate(
					'client'
				);

				const client = await Client.findById(userData?.client?._id).populate(
					'planType'
				);

				const data = userData?._doc || userData;
				data.client = client;

				if (data?.isActingAsClient) {
					data.isSuperAdmin = false;
					data.isSuperadmin = false;
					data.type = 'client';

					const client = await Client.findById(data?.actAsClient).populate(
						'planType'
					);
					data.client = client;
				}

				token = {
					...data,
					iat: token.iat,
					exp: token.exp,
					jti: token.jti,
				};
			}
			return { ...token, ...user };
		},
		// update session if group id given
		async session({ session, user, token }) {
			return { ...session, ...user, ...token };
		},
	},
	session: {
		jwt: true,
		// 24 hours
		maxAge: 24 * 60 * 60,
	},
	jwt: {
		secret: process.env.ACCESS_TOKEN_SIGNATURE,
		// 24 hours
		maxAge: 24 * 60 * 60,
	},
	pages: {
		signIn: '/auth/login',
	},
};

export default NextAuth(options);
