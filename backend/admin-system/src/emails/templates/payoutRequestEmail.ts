import { emailHeader } from '../components/header';
import { emailFooter } from '../components/footer';

export default function payoutRequestEmail(companyName: string, amount: number, requestId: number) {
  return `
    ${emailHeader('Payout Request Submitted')}
      <h1>Payout Request Received</h1>
      <p>Dear ${companyName},</p>
      <p>We have received your payout request:</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Request ID:</strong> # ${requestId}</p>
        <p><strong>Amount Requested:</strong> ₦ ${amount.toLocaleString()}</p>
        <p><strong>Status:</strong> Pending Review</p>
      </div>

      <p>Our team will review and process your payout within 3-5 business days.</p>
      <p>You will receive another email once the transfer is completed.</p>

      <p>Thank you for your patience.</p>
      <p>Best regards,<br><strong>The betasafar Team</strong></p>
    ${emailFooter()}
  `;
}
