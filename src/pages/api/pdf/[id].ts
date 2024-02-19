import dbConnect from '@/server/lib/db';
import certificate from '@/server/services/certificate';

import { PassThrough } from 'stream';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import Client from '@/server/models/Client';
import moment from 'moment';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import { parseDomain, ParseResultType } from 'parse-domain';

export default async function handler(req: any, res: any) {
	await dbConnect();
	const { id } = req.query;

	const dir = path.resolve('./public', 'pdf');
	// get client
	const client = await Client.findById(id)
		.populate('planType')
		.populate('subCompany')
		.populate('masterCompany')
		.exec();

	console.log('client', client);

	const pdfBytes = fs.readFileSync(dir + '/l.pdf');

	// Load the PDF file using pdf-lib
	const pdfDoc = await PDFDocument.load(pdfBytes);
	pdfDoc.registerFontkit(fontkit);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Get the width and height of the first page
	const { width, height } = page.getSize();

	let font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	// Link to the company website with underline
	font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	page.drawText('https://' + client.website, {
		x:
			width / 2 -
			font.widthOfTextAtSize('https://' + client.website, 9) / 2 +
			5,
		y: 367,
		size: 9,
		color: rgb(38 / 255, 59 / 255, 146 / 255),
		font,
	});

	// Draw underline for text
	page.drawLine({
		start: {
			x:
				width / 2 -
				font.widthOfTextAtSize('https://' + client.website, 9) / 2 +
				5,
			y: 365,
		},
		end: {
			x:
				width / 2 +
				font.widthOfTextAtSize('https://' + client.website, 9) / 2 +
				5,
			y: 365,
		},
		thickness: 1,
		color: rgb(38 / 255, 59 / 255, 146 / 255),
	});

	// Link to the company website
	// We are doing this if domain is www.domain.com or domain.net etc. we will turn it to 'domain.subdomains'
	const parseResult: any = parseDomain(client.website);
	const { subDomains, domain, topLevelDomains } = parseResult;

	page.drawText(domain + '.subdomains', {
		x: width / 2 - font.widthOfTextAtSize(domain + '.subdomains', 9) / 2 + 5,
		y: 354,
		size: 9,
		color: rgb(38 / 255, 59 / 255, 146 / 255),
		font,
	});

	// Draw underline for text
	page.drawLine({
		start: {
			x: width / 2 - font.widthOfTextAtSize(domain + '.subdomains', 9) / 2 + 5,
			y: 353,
		},
		end: {
			x: width / 2 + font.widthOfTextAtSize(domain + '.subdomains', 9) / 2 + 5,
			y: 353,
		},
		thickness: 1,
		color: rgb(38 / 255, 59 / 255, 146 / 255),
	});

	font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	// Like December 13, 2020
	page.drawText(
		'This Offshore Gaming License is valid until ' +
			moment(client.license.validUntil || Date.now()).format('LL') +
			',',
		{
			x:
				width / 2 -
				font.widthOfTextAtSize(
					'This Offshore Gaming License is valid until ' +
						moment(client.license.validUntil || Date.now()).format('LL') +
						',',
					12
				) /
					2 +
				5,

			y: 303.9,
			size: 12,
			color: rgb(49 / 255, 56 / 255, 63 / 255),
			font,
		}
	);
	// Lines
	page.drawLine({
		start: {
			x:
				width / 2 -
				font.widthOfTextAtSize(
					'This Offshore Gaming License is valid until ' +
						moment(client.license.validUntil || Date.now()).format('LL') +
						',',
					12
				) /
					2 +
				5,
			y: 302.5,
		},
		end: {
			x:
				width / 2 +
				font.widthOfTextAtSize(
					'This Offshore Gaming License is valid until ' +
						moment(client.license.validUntil || Date.now()).format('LL') +
						',',
					12
				) /
					2 +
				5,
			y: 302.5,
		},
		thickness: 0.8,
		color: rgb(49 / 255, 56 / 255, 63 / 255),
	});

	page.drawText('and is valid only at the operating address above indicated.', {
		x:
			width / 2 -
			font.widthOfTextAtSize(
				'and is valid only at the operating address above indicated.',
				12
			) /
				2 +
			5,

		y: 290.9,
		size: 12,
		color: rgb(49 / 255, 56 / 255, 63 / 255),
		font,
	});

	// Lines
	page.drawLine({
		start: {
			x:
				width / 2 -
				font.widthOfTextAtSize(
					'and is valid only at the operating address above indicated.',
					12
				) /
					2 +
				5,
			y: 289.5,
		},
		end: {
			x:
				width / 2 +
				font.widthOfTextAtSize(
					'and is valid only at the operating address above indicated.',
					12
				) /
					2 +
				5,
			y: 289.5,
		},
		thickness: 0.8,
		color: rgb(49 / 255, 56 / 255, 63 / 255),
	});

	font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	page.drawText(
		'this ' +
			moment(Date.now()).format('Do') +
			' day of ' +
			moment(Date.now()).format('MMMM YYYY'),
		{
			x:
				width / 2 -
				font.widthOfTextAtSize(
					'this ' +
						moment(Date.now()).format('Do') +
						' day of ' +
						moment(Date.now()).format('MMMM YYYY'),
					12
				) /
					2 +
				5,

			y: 195.2,
			size: 12,
			color: rgb(0.22, 0.24, 0.26),
			font,
		}
	);

	// Write ordinal number
	/*font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	page.drawText(getOrdinalSuffix(parseInt(moment(Date.now()).format('DD'))), {
		x:
			width / 2 -
			font.widthOfTextAtSize(
				'this ' +
					moment(Date.now()).format('DD') +
					'   day of ' +
					moment(Date.now()).format('MMMM YYYY'),
				12
			) /
				2 +
			43,

		y: 200.2,
		size: 8,
		color: rgb(0.22, 0.24, 0.26),
		font,
	});*/

	const pdf = await pdfDoc.save();
	const stream = new PassThrough();
	stream.end(pdf);

	res.setHeader('Content-Type', 'application/pdf');
	//res.setHeader('Content-Disposition', 'attachment; filename=license.pdf');
	stream.pipe(res);
}

const getOrdinalSuffix = (i: number) => {
	const j = i % 10,
		k = i % 100;
	if (j === 1 && k !== 11) {
		return 'st';
	}
	if (j === 2 && k !== 12) {
		return 'nd';
	}
	if (j === 3 && k !== 13) {
		return 'rd';
	}
	return 'th';
};

export async function handler2(req: any, res: any) {
	await dbConnect();
	const { id } = req.query;

	const dir = path.resolve('./public', 'pdf');
	// get client
	const client = await Client.findById(id)
		.populate('planType')
		.populate('subCompany')
		.populate('masterCompany')
		.exec();

	console.log('client', client);

	const pdfBytes = fs.readFileSync(dir + '/l.pdf');

	// Load the PDF file using pdf-lib
	const pdfDoc = await PDFDocument.load(pdfBytes);
	pdfDoc.registerFontkit(fontkit);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Get the width and height of the first page
	const { width, height } = page.getSize();

	let fontBytes = fs.readFileSync(dir + '/arial-bold.ttf');
	let font = await pdfDoc.embedFont(fontBytes);
	page.drawText(client.subCompany.name, {
		// calculate with char length
		x: width / 2 - client.subCompany.name.length * 3.5,
		y: 465,
		size: 11,
		color: rgb(0, 0, 0),
		font,
	});

	// Link to the company website with underline
	fontBytes = fs.readFileSync(dir + '/arial.ttf');
	font = await pdfDoc.embedFont(fontBytes);
	page.drawText('https://' + client.website, {
		x: width / 2 - ('https://' + client.website).length * 1.7,
		y: 365,
		size: 8,
		color: rgb(26 / 255, 24 / 255, 242 / 255),
		font,
	});

	// Draw underline for text
	page.drawLine({
		start: {
			x: width / 2 - ('https://' + client.website).length * 1.7,
			y: 363,
		},
		end: {
			x: width / 2 + ('https://' + client.website).length * 1.7 + 5,
			y: 364,
		},
		thickness: 0.6,
		color: rgb(26 / 255, 24 / 255, 242 / 255),
	});

	// Link to the company website
	// We are doing this if domain is www.domain.com or domain.net etc. we will turn it to 'domain.subdomains'
	const parseResult: any = parseDomain(client.website);
	const { subDomains, domain, topLevelDomains } = parseResult;

	page.drawText(domain + '.subdomains', {
		x: width / 2 - (domain + '.subdomains').length * 1.7 - 4,
		y: 354,
		size: 8,
		color: rgb(26 / 255, 24 / 255, 242 / 255),
		font,
	});

	// Draw underline for text
	page.drawLine({
		start: {
			x: width / 2 - (domain + '.subdomains').length * 1.7 - 4,
			y: 353,
		},
		end: {
			x: width / 2 + (domain + '.subdomains').length * 1.7 + 14 - 4,
			y: 353,
		},
		thickness: 0.6,
		color: rgb(26 / 255, 24 / 255, 242 / 255),
	});

	fontBytes = fs.readFileSync(dir + '/arial.ttf');
	font = await pdfDoc.embedFont(fontBytes);
	// Like December 13, 2020
	page.drawText(
		'until ' + moment(client.license.validUntil || Date.now()).format('LL'),
		{
			x:
				width / 2 +
				49 -
				(
					'until ' +
					moment(client.license.validUntil || Date.now()).format('LL')
				).length *
					0.5,
			y: 304.9,
			size: 12.3,
			color: rgb(58 / 255, 60 / 255, 68 / 255),
			font,
		}
	);

	fontBytes = fs.readFileSync(dir + '/arial-bold.ttf');
	font = await pdfDoc.embedFont(fontBytes);
	page.drawText(
		moment(Date.now()).format('Do') +
			' day of ' +
			moment(Date.now()).format('MMMM YYYY'),
		{
			x:
				width / 2 -
				50 -
				(
					moment(Date.now()).format('Do') +
					' day of ' +
					moment(Date.now()).format('MMMM, YYYY')
				).length *
					0.5,
			y: 195.2,
			size: 12,
			color: rgb(0.22, 0.24, 0.26),
			font,
		}
	);

	const pdf = await pdfDoc.save();
	const stream = new PassThrough();
	stream.end(pdf);

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'attachment; filename=license.pdf');
	stream.pipe(res);
}
