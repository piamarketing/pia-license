import bcrypt from 'bcrypt';
import User from '@/server/models/User';

export const login = async (email: string, password: string) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('user not found');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new Error('wrong password');
		}

		return user.populate('role');
	} catch (error) {
		throw error;
	}
};

export default {
	login,
};
