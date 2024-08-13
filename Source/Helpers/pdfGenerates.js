const path = require('path');
const { PDFDocument, rgb, StandardFonts, PDFLib} = require('pdf-lib');
const fs = require('fs');
const mongoose = require('mongoose');
const SubmittedCheckListModel = require('../Models/SubmitChecklistModel');
const ActivityModel = require('../Models/ActivityModel');
const SiteManagementModel = require('../Models/SiteManagementModel');

const generatePdf = async (payload) => {
    const spacing = 100; // Define spacing directly within the function
    
    try {
        const fetch = await import('node-fetch').then((mod) => mod.default);

        // Fetch data from database
        const checklist = await SubmittedCheckListModel.aggregate([
            { $match: { job_id: new mongoose.Types.ObjectId(payload?.job_id) } },
            {
                $lookup: {
                    from: 'jobdetails',
                    localField: 'job_id',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            {
                $unwind: {
                    path: '$jobInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        if (!checklist || checklist.length === 0) {
            throw new Error('Checklist not found or empty');
        }

        const siteInfo = await SiteManagementModel.findOne({
            _id: new mongoose.Types.ObjectId(checklist[0].jobInfo.siteId)
        });

        if (!siteInfo) {
            throw new Error('Site information not found');
        }

        const activityInfo = await ActivityModel.findOne({
            _id: new mongoose.Types.ObjectId(checklist[0].jobInfo.activityId)
        });

        if (!activityInfo) {
            throw new Error('Activity information not found');
        }
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size in points
        const { width, height } = page.getSize();

        // Embed standard font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;

        // Fetch and embed the image
        const imageUrl = 'http://18.61.82.213:3000/api/Face5_Logo2-2 text.png';
        const response = await fetch(imageUrl);
        const imageBytes = await response.arrayBuffer();
        const image = await pdfDoc.embedPng(imageBytes);

        // Draw the image on the left side
        const imageDims = image.scale(0.1); // Adjust scale as needed
        const imageX = 50;
        const imageY = height - imageDims.height - 50;
        page.drawImage(image, {
            x: imageX,
            y: imageY,
            width: imageDims.width,
            height: imageDims.height
        });

        // Draw the address on the right side occupying only 50% of the page width
        const addressText = `${siteInfo?.address?.fullAddress}`;
        const addressFontSize = 14;
        const maxTextWidth = width * 0.4; // 50% of the page width
        const textWidth = font.widthOfTextAtSize(addressText, addressFontSize);
        const addressX = width - maxTextWidth - 60;
        const addressY = height - 60;

        page.drawText(addressText, {
            x: addressX,
            y: addressY,
            size: addressFontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: maxTextWidth // Limit the text width to 50% of the page
        });

        // Draw the title in the center below the image and address
        const titleText = activityInfo.title;
        const titleFontSize = 26;
        const titleWidth = font.widthOfTextAtSize(titleText, titleFontSize);
        const titleX = (width - titleWidth) / 2;
        const titleY = imageY - 75; // Adjust as needed to provide spacing
        page.drawText(titleText, {
            x: titleX,
            y: titleY,
            size: titleFontSize,
            font,
            color: rgb(0, 0, 0)
        });

        // Draw the task details section
        const detailFontSize = 12;
        const detailFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const taskIdText = `Task ID: ${checklist[0].jobInfo.jobId}`;
        const completionDateText = `Completion Date: ${checklist[0].createdAt.toISOString().split('T')[0]}`;
        const taskTitleText = `Task Title: ${checklist[0].jobInfo.jobTitle}`;

        // Define positions
        const margin = 50;
        const detailStartY = titleY - 50; // Adjust starting position

        // Draw Task ID and Completion Date
        page.drawText(taskIdText, {
            x: margin,
            y: detailStartY,
            size: detailFontSize,
            font: boldFont,
            color: rgb(0, 0, 0)
        });
        page.drawText(completionDateText, {
            x: width - margin - detailFont.widthOfTextAtSize(completionDateText, detailFontSize),
            y: detailStartY,
            size: detailFontSize,
            font: boldFont,
            color: rgb(0, 0, 0)
        });

        // Draw Task Title
        const taskTitleY = detailStartY - 30; // Adjust spacing
        page.drawText(taskTitleText, {
            x: margin,
            y: taskTitleY,
            size: detailFontSize,
            font: boldFont,
            color: rgb(0, 0, 0)
        });

        // Define table properties
        const headerHeight = 50; // Height of the header row
        const rowHeight = 25; // Height of each row
        const colWidths = [80, 300, 100]; // Column widths (adjust as necessary)
        const tableWidth = colWidths.reduce((a, b) => a + b, 0); // Total table width

        // Calculate table top position based on titles and image
        const tableTop = taskTitleY - rowHeight - headerHeight - 20; // Adjust as needed for space above table

        // Draw table header
        const headerY = tableTop + headerHeight;
        page.drawRectangle({
            x: 50,
            y: headerY - headerHeight,
            width: tableWidth,
            height: headerHeight,
            color: rgb(0.8, 0.8, 0.8) // Light gray background for header
        });

        page.drawText('S.No', {
            x: 50 + 5, // X position with padding
            y: headerY - headerHeight / 2 - fontSize / 2, // Centered vertically within header row
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: colWidths[0], // Limit text width to column width
            textAlign: 'center' // Center-align text
        });
        page.drawText('Activities to be Carried Out', {
            x: 50 + colWidths[0] + 5, // X position with padding
            y: headerY - headerHeight / 2 - fontSize / 2,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: colWidths[1], // Limit text width to column width
            textAlign: 'left' // Left-align text
        });
        page.drawText('Action', {
            x: 50 + colWidths[0] + colWidths[1] + 5, // X position with padding
            y: headerY - headerHeight / 2 - fontSize / 2,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: colWidths[2], // Limit text width to column width
            textAlign: 'center' // Center-align text
        });

        // Draw table lines
        let currentY = tableTop;
        page.drawLine({
            start: { x: 50, y: currentY },
            end: { x: 50 + tableWidth, y: currentY },
            color: rgb(0, 0, 0), // Black line color
            thickness: 1
        });

        currentY -= rowHeight;

        checklist[0].submittedData.forEach((record, index) => {
            page.drawRectangle({
                x: 50,
                y: currentY,
                width: tableWidth,
                height: rowHeight,
                color: rgb(1, 1, 1), // White background for rows
                thickness: 1
            });

            page.drawText(`${index + 1}`, {
                x: 50 + 5, // X position with padding
                y: currentY + rowHeight / 2 - fontSize / 2, // Centered vertically within row
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
                maxWidth: colWidths[0], // Limit text width to column width
                textAlign: 'center' // Center-align text
            });
            page.drawText(record.field_name, {
                x: 50 + colWidths[0] + 5, // X position with padding
                y: currentY + rowHeight / 2 - fontSize / 2,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
                maxWidth: colWidths[1], // Limit text width to column width
                textAlign: 'left' // Left-align text
            });
            page.drawText(record.field_value, {
                x: 50 + colWidths[0] + colWidths[1] + 5, // X position with padding
                y: currentY + rowHeight / 2 - fontSize / 2,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
                maxWidth: colWidths[2], // Limit text width to column width
                textAlign: 'center' // Center-align text
            });

            page.drawLine({
                start: { x: 50, y: currentY },
                end: { x: 50 + tableWidth, y: currentY },
                color: rgb(0, 0, 0), // Black line color
                thickness: 1
            });

            currentY -= rowHeight;
        });

        // Draw column lines
        let xOffset = 50;
        colWidths.forEach((width) => {
            page.drawLine({
                start: { x: xOffset, y: tableTop + headerHeight },
                end: { x: xOffset, y: currentY + rowHeight },
                color: rgb(0, 0, 0), // Black line color
                thickness: 1
            });
            xOffset += width;
        });

        // Draw the right side end line
        page.drawLine({
            start: { x: xOffset, y: tableTop + headerHeight },
            end: { x: xOffset, y: currentY + rowHeight },
            color: rgb(0, 0, 0), // Black line color for the right side end
            thickness: 1
        });

        // Draw the bottom line of the table
        page.drawLine({
            start: { x: 50, y: currentY + rowHeight },
            end: { x: 50 + tableWidth, y: currentY + rowHeight },
            color: rgb(0, 0, 0), // Black line color
            thickness: 1
        });        

        // Define the technician's name, the label, and the desired font size
        const techNameText = checklist[0].jobInfo.techName;
        const techLabel = 'Technician:';
        
        const xPosition = 50; // X position from the left edge of the page
        const yPosition = 50; // Y position from the bottom edge of the page

        // Draw the technician's name at the calculated position
        page.drawText(techNameText, {
            x: xPosition, // X position from the left edge
            y: yPosition + 10, // Y position from the bottom edge
            size: fontSize + 2, // Font size
            font, // Font to use
            color: rgb(0, 0, 0) // Text color (black)
        });

        // Draw the "Technician" label below the technician's name
        let techLabelfontsize = 16;
        page.drawText(techLabel, {
            x: xPosition, // X position from the left edge
            y: yPosition - fontSize, // Y position below the technician's name
            size: techLabelfontsize, // Font size
            font, // Font to use
            color: rgb(0, 0, 0) // Text color (black)
        });


        // Fetch and embed the signature image
        const signImageUrl = payload.sign_url;
        const signResponse = await fetch(signImageUrl);
        const signImageBytes = await signResponse.arrayBuffer();
        const signImage = await pdfDoc.embedPng(signImageBytes);

        // Draw the signature image in the bottom right corner
        const signImageScale = 0.5; // Adjust scale as needed
        const signImageDims = signImage.scale(signImageScale);
        const signImageX = width - signImageDims.width - 50; // 50 points from the right edge
        const signImageY = 50; // 50 points from the bottom edge

        page.drawImage(signImage, {
            x: signImageX,
            y: signImageY + 20,
            width: signImageDims.width,
            height: signImageDims.height
        });

        // Draw the "sign" text below the signature image
        const signText = 'Signature ';
        const signFontSize = 20;
        const signTextWidth = font.widthOfTextAtSize(signText, signFontSize);
        const signTextX = signImageX + (signImageDims.width - signTextWidth) / 2; // Center the text under the image
        const signTextY = signImageY - signFontSize - 1; // 5 points below the image

        page.drawText(signText, {
            x: signTextX,
            y: signTextY + 20,
            size: signFontSize,
            font,
            color: rgb(0, 0, 0)
        });

        // const outputPath = path.resolve('/home/developer/Documents/arulmani/resource/face5_node_api/Source/', 'output.pdf');
        const pdfBytes = await pdfDoc.save();
        const outputPath = path.resolve(__dirname, 'output.pdf');
        fs.writeFileSync(outputPath, pdfBytes);

        console.log('PDF generated successfully:', outputPath);
        return outputPath;
    } catch (err) {
        console.error('Error processing request:', err);
        throw err;
    }
};

module.exports = { generatePdf };
