import { emailHeader } from '../components/header';
import { emailFooter } from '../components/footer';

export default function newBookingEmail({
  companyName,
  bookingId,
  pilgrimName,
  packageTitle,
  numberOfPilgrims,
  totalAmount,
}: {
  companyName: string;
  bookingId: number;
  pilgrimName: string;
  packageTitle: string;
  numberOfPilgrims: number;
  totalAmount: number;
}) {
  return `
    ${emailHeader('New Booking Received!')}
      <h1 style="color: #28a745;">New Booking Alert 🎉</h1>
      <p>Congratulations, ${companyName}!</p>
      <p>You have received a new booking:</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> #${bookingId}</p>
        <p><strong>Pilgrim:</strong> ${pilgrimName}</p>
        <p><strong>Package:</strong> ${packageTitle}</p>
        <p><strong>Number of Pilgrims:</strong> ${numberOfPilgrims}</p>
        <p><strong>Total Amount:</strong> ₦${totalAmount.toLocaleString()}</p>
      </div>

      <p style="text-align: center;">
        <a href="https://operator.betasafar.app/bookings/${bookingId}" class="button">View Booking Details</a>
      </p>

      <p>Please contact the pilgrim and prepare for their journey.</p>
      <p>Best regards,<br><strong>The betasafar Team</strong></p>
    ${emailFooter()}
  `;
}