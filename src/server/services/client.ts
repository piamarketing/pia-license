// @tss-nocheck
import Client from "@/server/models/Client";
import Invoice from "@/server/models/Invoice";
import mongoose from "mongoose";
import Product from "../models/Product";
import veripagcor from "./veripagcor";
import moment from "moment";
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET);

export const getClients = async () => {
  try {
    const clients = await Client.find({}).populate("planType");
    return clients;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getClientById = async (id: string) => {
  try {
    const client = await Client.aggregate([
      {
        $match: {
          // Convert to ObjectId
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planType",
          foreignField: "_id",
          as: "planType",
        },
      },
      {
        $unwind: {
          path: "$planType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "planType.products",
          foreignField: "_id",
          as: "planType.products",
        },
      },
    ]);

    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createClient = async (client: any) => {
  try {
    /*const { error } = validateClient(client);
		if (error) {
			throw error;
		}*/

    const newClient = new Client(client);
    await newClient.save();

    return newClient;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateClient = async (id: string, client: any) => {
  try {
    /*const { error } = validateClient(client);
		if (error) {
			throw error;
		}*/

		if (client._id) {
			delete client._id;
		}

    const clientData = await Client.findOne({
      _id: id,
    }).populate("planType");

    let rPr = [];
    if (client.planType?.products) {
      delete client.planType.products;
    }

    if (client.billingItems) {
      const rBi = await client.billingItems.map(async (item: any) => {
				if (item.basePrice || item.price) {
					if (
						parseFloat(item.basePrice) !==
						parseFloat(item.price)
					) {
						if (item.revisedPrice !== item.price) {
							const newPrice = await stripe.prices.create({
								product: item.stripeProductId,
								unit_amount: item.price * 100,
								currency: "eur",
							});
							item.revisedStripeData = newPrice;
							item.revisedPrice = item.price;
							console.log("newPrice", newPrice);
						}
					} else {
						item.revisedPrice = null;
						item.revisedStripeData = null;
					}
				}
				return await item;
      });

			client.billingItems = await Promise.all(rBi);
    }

    if (client.revisedProducts) {
      rPr = await client.revisedProducts.map(async (product: any) => {
        if (
          parseFloat(product.stripeData?.price?.unit_amount) !==
          parseFloat(product.price) * 100
        ) {
          const newPrice = await stripe.prices.create({
            product: product.stripeData.product.id,
            unit_amount: product.price * 100,
            currency: "eur",
          });
          product.stripeData.price = newPrice;
        }
        return await product;
      });
      client.revisedProducts = await Promise.all(rPr);
    }

    let dR = {};
    if (client.revisedDomainPrice) {
      if (
        parseFloat(clientData.revisedDomainStripeData?.price?.unit_amount) !==
        parseFloat(client.revisedDomainPrice) * 100
      ) {
        const newPrice = await stripe.prices.create({
          product: clientData.planType.domainStripeData.product.id,
          unit_amount: client.revisedDomainPrice * 100,
          currency: "eur",
        });
        dR = {
          price: newPrice,
          product: clientData.planType.domainStripeData.product,
        };

        client.revisedDomainStripeData = dR;
      }
    }

    const updatedClient = await Client.findOneAndUpdate(
      {
        _id: id,
      },
      client,
      { new: true }
    );
    return updatedClient;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const deletedClient = await Client.findOneAndDelete({
      _id: id,
    });
    return deletedClient;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveClient = async (id: string) => {
  try {
    const client = await Client.aggregate([
      {
        $match: {
          // Convert to ObjectId
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planType",
          foreignField: "_id",
          as: "planType",
        },
      },
      {
        $unwind: {
          path: "$planType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "planType.products",
          foreignField: "_id",
          as: "planType.products",
        },
      },
    ]);

    /*
		let products = client[0].revisedProducts;
		if (!products) {
			products = client[0].planType.products;
		} else if (products.length < client[0].planType.products.length) {
			// search and fill the missing products
			const missingProducts = client[0].planType.products.filter(
				(product: any) => {
					return !products.find(
						(p: any) => p._id.toString() === product._id.toString()
					);
				}
			);
			products = [...products, ...missingProducts];
		}
		const totalAmount = products.reduce(
			(acc: number, product: any) => parseFloat(product.price || 0) + acc,
			0
		);

		// Create new stripe invoice
		const stripeInvoice = await stripe.invoices.create({
			customer: client[0].stripeCustomer.id,
			collection_method: 'send_invoice',
			days_until_due: 0,
		});

		let stripeInvoiceItems = [];
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const stripeProduct = await stripe.invoiceItems.create({
				invoice: stripeInvoice.id,
				customer: client[0].stripeCustomer.id,
				price: product.stripeData.price.id,
			});
			stripeInvoiceItems.push(stripeProduct);
		}

		await stripe.invoices.sendInvoice(stripeInvoice.id);

		// Retrieve invoice from stripe
		const stripeInvoiceData = await stripe.invoices.retrieve(stripeInvoice.id);

		const stripeData = {
			...stripeInvoiceData,
			items: stripeInvoiceItems,
		};

		// Create new invoice
		const invoice = new Invoice({
			client: client[0]._id,
			totalAmount,
			planType: client[0].planType._id,
			_for: 'license',
			forPlan: true,
			status: 'pending',
			stripeData,
		});
		await invoice.save();
		*/

    await Client.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isActive: true,
      },
      { new: true }
    );

    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createExtraInvoice = async (id: string, product: any) => {
  try {
    const client = await Client.aggregate([
      {
        $match: {
          // Convert to ObjectId
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planType",
          foreignField: "_id",
          as: "planType",
        },
      },
      {
        $unwind: {
          path: "$planType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "planType.products",
          foreignField: "_id",
          as: "planType.products",
        },
      },
    ]);

    const productData = await Product.findOne({
      _id: product,
    });

    // Create new stripe invoice
    const stripeInvoice = await stripe.invoices.create({
      customer: client[0].stripeCustomer.id,
      collection_method: "send_invoice",
      days_until_due: 0,
    });

    const stripeProduct = await stripe.invoiceItems.create({
      invoice: stripeInvoice.id,
      customer: client[0].stripeCustomer.id,
      price: productData.stripeData.price.id,
    });

    await stripe.invoices.sendInvoice(stripeInvoice.id);

    // Retrieve invoice from stripe
    const stripeInvoiceData = await stripe.invoices.retrieve(stripeInvoice.id);

    const stripeData = {
      ...stripeInvoiceData,
      items: [stripeProduct],
    };

    // Create new invoice
    const invoice = new Invoice({
      client: client[0]._id,
      totalAmount: productData.price,
      planType: client[0].planType._id,
      products: [productData._id],
      _for: "extra",
      forPlan: false,
      status: "pending",
      stripeData,
    });

    await invoice.save();

    return invoice;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const syncClient = async (id: string, payload: any) => {
  try {
    const { config } = payload;
    const client = await Client.findOne({
      _id: id,
    })
      .populate("planType")
      .populate("masterCompany")
      .populate("subCompany");

    if (!client) {
      throw new Error("Client not found");
    }

    const website = client.website || "";

    const mainDomainsCommaSeparated = client.domains
      .map((domain: any) => domain.main)
      .join(",");
    const mobileDomainsCommaSeparated = client.domains
      .map((domain: any) => domain.mobile)
      .join(",");
    const email = `license@${website}`;
    const companyName = client.subCompany?.name || "";
    const companyAddress = client.subCompany?.address || "";
    const status = client.isActive ? 1 : 0;
    const isProvider = client.isProvider ? 1 : 0;

    // Mysql formatted date
    const licenseStartedAt = moment(client.license.startedAt).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const licenseEndedAt = moment(client.license.validUntil).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const clientFromMysql = (await veripagcor.getClient(website)) || [];

    /*
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
			*/

    if (clientFromMysql.length == 0) {
      console.log("Creating client in mysql");
      if (config.createNew) {
        try {
          const mysqlClient = await veripagcor.createClient(
            website,
            mainDomainsCommaSeparated,
            mobileDomainsCommaSeparated,
            companyName,
            companyAddress,
            email,
            status,
            isProvider,
            licenseStartedAt,
            licenseEndedAt
          );

          await Client.findOneAndUpdate(
            {
              _id: id,
            },
            {
              lastSyncedAt: new Date(),
            },
            { new: true }
          );

          return client;
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        throw new Error("Creating new client is disabled");
      }
    }

    console.log("Updating client in mysql");

    if (config.license) {
      console.log("Updating license");
      try {
        const mysqlClient = await veripagcor.updateLicense(
          website,
          licenseStartedAt,
          licenseEndedAt
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    if (config.domains) {
      console.log("Updating domains");
      try {
        const mysqlClient = await veripagcor.updateDomains(
          website,
          mainDomainsCommaSeparated,
          mobileDomainsCommaSeparated
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    if (config.company) {
      console.log("Updating company");
      console.log(companyName);
      try {
        const mysqlClient = await veripagcor.updateCompanyName(
          website,
          companyName
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    if (config.isProvider) {
      console.log("Updating isProvider");
      try {
        const mysqlClient = await veripagcor.updateIsProvider(
          website,
          isProvider
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    if (config.status) {
      console.log("Updating status");
      try {
        const mysqlClient = await veripagcor.updateStatus(website, status);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    await Client.findOneAndUpdate(
      {
        _id: id,
      },
      {
        lastSyncedAt: new Date(),
      },
      { new: true }
    );

    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClientsFromMysql = async () => {
  try {
    const clients = await veripagcor.getClientList();

    const formattedClients = await clients.map(async (client: any) => {
      const mainDomains = client.domain.split(",");
      const mobileDomains = client.mobile_domain.split(",");
      const domains = mainDomains.map((domain: string, index: number) => {
        return {
          main: domain,
          mobile: mobileDomains[index],
        };
      });

      const website = client.website || "";
      const isActive = client.status == 1 ? true : false;
      const isProvider = client.is_provider_mode == 1 ? true : false;
      const license = {
        startedAt: client.license_start,
        validUntil: client.license_end,
      };
      const email = client.email || "";

      const customer = await stripe.customers.create({
        name: website,
        email: email,
      });

      // random number
      const randomNumber = Math.floor(Math.random() * 1000000000);

      const formattedClient = {
        domains,
        website,
        isActive,
        isProvider,
        license,
        email,
        contactEmail: email,
        stripeCustomer: customer,
        phone: randomNumber,
      };

      return formattedClient;
    });

    const clientsToCreate = await Promise.all(formattedClients);

    clientsToCreate.forEach(async (client: any) => {
      const data = await Client.create(client);
      // wait 1 second
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    return clients;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  approveClient,
  createExtraInvoice,
  syncClient,
  getClientsFromMysql,
};
