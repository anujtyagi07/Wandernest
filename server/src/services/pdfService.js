import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { mkdirSync, existsSync } from 'fs';
import { formatINR } from '../utils/helpers.js';

const RECEIPTS_DIR = 'uploads/receipts';

/**
 * Generate a PDF booking receipt and return the file path
 */
export const generateBookingReceipt = async (booking, packageOrHotel) => {
  if (!existsSync(RECEIPTS_DIR)) mkdirSync(RECEIPTS_DIR, { recursive: true });

  const filename = `booking-${booking._id}.pdf`;
  const filepath = `${RECEIPTS_DIR}/${filename}`;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = createWriteStream(filepath);

    stream.on('finish', () => resolve(`/uploads/receipts/${filename}`));
    stream.on('error', reject);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100;

    // ── Header ──
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#FF6B35').text('WanderNest', 50, 50);
    doc.fontSize(10).font('Helvetica').fillColor('#666')
      .text('Luxury Travel Booking Platform', 50, 82)
      .text('Rishikesh, Uttarakhand, India', 50, 95);

    // Booking ID badge
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#2B3A52')
      .text('BOOKING CONFIRMATION', 50, 125);
    doc.fontSize(10).font('Helvetica').fillColor('#FF6B35')
      .text(`ID: ${booking._id}`, 50, 142);

    // Divider
    doc.moveTo(50, 165).lineTo(50 + pageWidth, 165).strokeColor('#FF6B35').lineWidth(1).stroke();

    // ── Booking Details ──
    let y = 185;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#2B3A52').text('Booking Details', 50, y);
    y += 22;

    const details = [
      ['Status', booking.status.toUpperCase()],
      ['Booking Type', booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)],
      ['Booking Date', new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
      ['Travel Date', new Date(booking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
    ];

    if (packageOrHotel) {
      details.push([booking.bookingType === 'package' ? 'Package' : 'Hotel', packageOrHotel.title || packageOrHotel.name]);
    }

    details.push(['Guests', `${booking.adults} Adults${booking.children ? `, ${booking.children} Children` : ''}`]);

    for (const [label, value] of details) {
      doc.fontSize(9).font('Helvetica').fillColor('#999').text(label, 50, y);
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(value, 200, y);
      y += 18;
    }

    // ── Traveler Info ──
    y += 10;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#2B3A52').text('Traveler Information', 50, y);
    y += 22;

    const travelerInfo = [
      ['Name', booking.traveler.name],
      ['Email', booking.traveler.email],
      ['Phone', booking.traveler.phone],
    ];

    for (const [label, value] of travelerInfo) {
      doc.fontSize(9).font('Helvetica').fillColor('#999').text(label, 50, y);
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(value, 200, y);
      y += 18;
    }

    // ── Payment Summary ──
    y += 15;
    doc.moveTo(50, y).lineTo(50 + pageWidth, y).strokeColor('#eee').lineWidth(0.5).stroke();
    y += 15;

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#2B3A52').text('Payment Summary', 50, y);
    y += 25;

    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Total Amount', 50, y);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#FF6B35').text(formatINR(booking.totalAmount), 200, y - 2);
    y += 22;

    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Payment Status', 50, y);
    const statusColor = booking.paymentStatus === 'paid' ? '#16a34a' : '#d97706';
    doc.fontSize(10).font('Helvetica-Bold').fillColor(statusColor).text(booking.paymentStatus.toUpperCase(), 200, y);
    y += 25;

    // ── Special Requests ──
    if (booking.specialRequests) {
      y += 5;
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#2B3A52').text('Special Requests', 50, y);
      y += 20;
      doc.fontSize(10).font('Helvetica').fillColor('#666')
        .text(booking.specialRequests, 50, y, { width: pageWidth, align: 'left' });
      y += 40;
    }

    // ── Cancellation Policy ──
    y = Math.max(y + 20, 580);
    doc.moveTo(50, y).lineTo(50 + pageWidth, y).strokeColor('#eee').lineWidth(0.5).stroke();
    y += 15;

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#999').text('CANCELLATION POLICY', 50, y);
    y += 15;
    doc.fontSize(8).font('Helvetica').fillColor('#999')
      .text('Free cancellation up to 7 days before travel (full refund).', 50, y)
      .text('3-7 days before travel: 25% cancellation fee applies.', 50, y + 12)
      .text('Within 3 days of travel: non-refundable (rescheduling available).', 50, y + 24);

    // ── Footer ──
    doc.fontSize(8).font('Helvetica').fillColor('#ccc')
      .text('This is a computer-generated receipt. For support, contact hello@wandernest.in', 50, 760, { width: pageWidth, align: 'center' });

    doc.end();
  });
};
