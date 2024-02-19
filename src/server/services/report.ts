import Invoice from "@/server/models/Invoice";
import Ticket from "../models/Ticket";
import Client from "../models/Client";
import Domain from "../models/Domain";
import PaymentNotice from "../models/PaymentNotice";
import Product from "../models/Product";
import Plan from "../models/Plan";
import Company from "../models/Company";

const clientDashboard = async (session: any) => {
  try {
    // Get unpaid invoice count and total
    const unpaidInvoices = await Invoice.aggregate([
      {
        $match: {
          client: session.client._id,
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const pendingSupportTickets = await Ticket.aggregate([
      {
        $match: {
          client: session.client._id,
          status: "pending-reply",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const returnData = {
      unpaidInvoices: unpaidInvoices[0] || { count: 0, total: 0 },
      pendingSupportTickets: pendingSupportTickets[0] || { count: 0 },
    };

    return returnData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const adminDashboard = async (session: any) => {
  try {
    // Return pending and paid invoices with total and count
    const invoices = await Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalClients = await Client.countDocuments({});

    const totalDomains = await Domain.aggregate([
      {
        $group: {
          _id: null,
          count: {
            $sum: {
              $size: "$domains",
            },
          },
        },
      },
    ]);

    const totalTickets = await Ticket.countDocuments({
      status: "open",
    });

    const totalProducts = await Product.countDocuments({});
    const totalPlans = await Plan.countDocuments({});
    const totalCompanies = await Company.countDocuments({});

    // Order clients by closest to license.validUntil
    const clients = await Client.find({
      //'license.validUntil': { $gt: new Date() },
    })
      .sort({ "license.validUntil": 1 })
      .limit(5);

    const tickets = await Ticket.find({
      status: "pending-reply",
    })
      .limit(5)
      .populate("client");

    const paymentNotices = await PaymentNotice.find({
      status: "pending",
    })
      .limit(5)
      .populate("client")
      .populate("invoice");

    // return daily revenue of last 7 days this is for chart so return like 2020-01-01
    const dailyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: {
            $substr: ["$createdAt", 0, 10],
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 7,
      },
    ]);

    const returnData = {
      invoicesPaid: invoices.find((i: any) => i._id === "paid") || {
        count: 0,
        total: 0,
      },
      invoicesPending: invoices.find((i: any) => i._id === "pending") || {
        count: 0,
        total: 0,
      },
      totalClients,
      totalTickets,
      totalDomains: totalDomains[0] || { count: 0 },
      clients,
      tickets,
      paymentNotices,
      totalProducts,
      totalPlans,
      totalCompanies,
      dailyRevenue,
    };

    return returnData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const dashboard = async (session: any) => {
  try {
    console.log("session", session);
    if (session.type === "client") {
      return clientDashboard(session);
    } else {
      return adminDashboard(session);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generalReport = async (
  session: any,
  startDate: any,
  endDate: any
) => {
  try {
		let data = {
			invoices: {
				count: 0,
				// total pending amount
				pending: 0,
				// total paid amount
				paid: 0,
			},
			domains: {
				count: 0,
				total: 0,
			},
			clients: {}
		};

		const invoices = await Invoice.aggregate([
			{
				$match: {
					paidAt: {
						$gte: new Date(startDate),
						$lte: new Date(endDate),
					},
				},
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
					total: { $sum: "$totalAmount" },
				},
			},
		]);

		const domains = await Domain.aggregate([
			{
				$match: {
					createdAt: {
						$gte: new Date(startDate),
						$lte: new Date(endDate),
					},
					isActive: true,
				},
			},
			{
				$group: {
					_id: null,
					count: {
						$sum: {
							$size: "$domains",
						},
					},
					total: {
						$sum: "$totalPrice",
					},
				},
			},
		]);

		// Return clients by count and total paid invoices and domain price by date range
		const clients = await Client.aggregate([
			{
				$match: {
					// All
					_id: {
						$ne: null,
					}
				}
			},
			{
				$lookup: {
					from: "invoices",
					localField: "_id",
					foreignField: "client",
					as: "invoices",
				},
			},
			{
				$lookup: {
					from: "domains",
					localField: "_id",
					foreignField: "client",
					as: "domains",
				},
			},
			{
				$project: {
					_id: 1,
					website: 1,
					invoices: {
						$filter: {
							input: "$invoices",
							as: "invoice",
							cond: {
								$and: [
									{
										$gte: ["$$invoice.paidAt", new Date(startDate)],
									},
									{
										$lte: ["$$invoice.paidAt", new Date(endDate)],
									},
								],
							},
						},
					},
					domains: {
						$filter: {
							input: "$domains",
							as: "domain",
							cond: {
								$and: [
									{
										$gte: ["$$domain.updatedAt", new Date(startDate)],
									},
									{
										$lte: ["$$domain.updatedAt", new Date(endDate)],
									},
									{
										$eq: ["$$domain.isActive", true],
									}
								],
							},
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					website: 1,
					invoices: {
						$reduce: {
							input: "$invoices",
							initialValue: {
								count: 0,
								total: 0,
							},
							in: {
								count: { $add: ["$$value.count", 1] },
								total: { $add: ["$$value.total", "$$this.totalAmount"] },
							},
						},
					},
					domains: {
						$reduce: {
							input: "$domains",
							initialValue: {
								count: 0,
								total: 0,
							},
							in: {
								count: { $sum: [ { $size: "$$this.domains" }, "$$value.count" ] },
								total: { $add: ["$$value.total", "$$this.totalPrice"] },
							}
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					website: 1,
					invoices: 1,
					domains: 1,
					total: {
						$add: [
							"$invoices.total",
							"$domains.total",
						],
					},
				},
			}
		]);




		data.invoices.count = invoices.reduce((a: any, b: any) => a + b.count, 0);
		data.invoices.paid = invoices.find((i: any) => i._id === "paid")?.total || 0;
		data.domains.count = domains[0]?.count || 0;
		data.domains.total = domains[0]?.total || 0;
		data.clients = clients;

		return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
