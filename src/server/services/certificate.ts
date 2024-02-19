import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import Client from '../models/Client';
import moment from 'moment';
import path from 'path';

export default async function certificate(id: string) {
	const dir = path.resolve('./public', 'pdf');
	// get client
	const client = await Client.findById(id)
		.populate('planType')
		.populate('subCompany')
		.populate('masterCompany')
		.exec();

	const pdfBytes = fs.readFileSync(dir + '/lic-base.pdf');

	// Load the PDF file using pdf-lib
	const pdfDoc = await PDFDocument.load(pdfBytes);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Get the width and height of the first page
	const { width, height } = page.getSize();

	let font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	page.drawText(client.subCompany.name, {
		// calculate with char length
		x: width / 2 - client.subCompany.name.length * 3.5,
		y: 465,
		size: 11,
		color: rgb(0, 0, 0),
		font,
	});

	// Link to the company website with underline
	font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	page.drawText('https://' + client.website, {
		x: width / 2 - ('https://' + client.website).length * 1.7,
		y: 365,
		size: 8,
		color: rgb(0, 0, 1),
		font,
	});

	font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	// Like December 13, 2020
	page.drawText(
		'untila ' + moment(client.license.validUntil || Date.now()).format('LL'),
		{
			x:
				width / 2 +
				50 -
				(
					'untila ' +
					moment(client.license.validUntil || Date.now()).format('LL')
				).length *
					0.5,
			y: 305,
			size: 12,
			color: rgb(58, 60, 68),
			font,
		}
	);

	// Like 7th day of December 2020 but with ordinal numbers
	font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
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

	// Save the modified PDF file
	const modifiedPdfBytes = await pdfDoc.save();
	// Do not write to disk because it is not necessary just return the buffer
	console.log('modifiedPdfBytes', modifiedPdfBytes);
	return modifiedPdfBytes.buffer;
}
