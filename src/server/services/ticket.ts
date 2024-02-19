// @tss-nocheck
import Ticket from '@/server/models/Ticket';

export const getTickets = async (session?: any) => {
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
	try {
		// Open tickets on top and then sort by date
		const tickets = await Ticket.find({
			...adfilters.normal,
		})
			.populate('client')
			.populate('user')
			.sort({
				status: -1,
				createdAt: -1,
			});

		return tickets;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getTicketById = async (id: string) => {
	try {
		const ticket = await Ticket.findOne({
			_id: id,
		})
			.populate('client')
			.populate('user');
		return ticket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const takeTicket = async (id: string, admin: string) => {
	try {
		const ticket = await Ticket.findOne({
			_id: id,
		});

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		if (ticket.user) {
			throw new Error('Ticket already taken');
		}

		ticket.user = admin;
		await ticket.save();
		return ticket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createTicket = async (ticket: any) => {
	try {
		/*const { error } = validateTicket(ticket);
		if (error) {
			throw error;
		}*/

		const ticketId = (await Ticket.countDocuments()) + 100001;
		ticket.ticketId = ticketId;
		const newTicket = new Ticket(ticket);
		await newTicket.save();

		return newTicket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateTicket = async (id: string, ticket: any) => {
	try {
		/*const { error } = validateTicket(ticket);
		if (error) {
			throw error;
		}*/

		const updatedTicket = await Ticket.findOneAndUpdate(
			{
				_id: id,
			},
			ticket,
			{ new: true }
		);
		return updatedTicket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteTicket = async (id: string) => {
	try {
		const deletedTicket = await Ticket.findOneAndDelete({
			_id: id,
		});
		return deletedTicket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const replyTicket = async (
	id: string,
	message: string,
	from: string
) => {
	try {
		const ticket = await Ticket.findOne({
			_id: id,
		});
		if (!ticket) {
			throw new Error('Ticket not found');
		}
		ticket.messages.push({
			from,
			message,
			createdAt: new Date(),
		});
		if (from === 'client') {
			ticket.status = 'open';
		} else if (from === 'admin') {
			ticket.status = 'pending-reply';
		}
		await ticket.save();
		return ticket;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	deleteTicket,
	replyTicket,
	takeTicket,
};
