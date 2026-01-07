import { emailHeader } from '../components/header';
import { emailFooter } from '../components/footer';

export default function verificationUpdateEmail(companyName: string, status: 'approved' | 'rejected' | 'under_review') {
  const statusText = status === 'approved' ? 'Approved ✅' : status === 'rejected' ? 'Rejected ❌' : 'Under Review ⏳';
  const statusColor = status === 'approved' ? '#28a745' : status === 'rejected' ? '#dc3545' : '#ffc107';

  return `
    ${emailHeader('Verification Update')}
      <h1 style="color: ${statusColor}; text-align: center;">${statusText}</h1>
      <p>Dear ${companyName},</p>
      <p>We have reviewed your operator registration on <strong>betasafar Platform</strong>.</p>
      <p>Your account status is now: <strong>${statusText}</strong></p>

      ${status === 'approved' ? `
      <p>Congratulations! You can now create packages and start receiving bookings from pilgrims.</p>
      <p style="text-align: center;">
        <a href="https://operator.betasafar.app/dashboard" class="button">Go to Dashboard</a>
      </p>
      ` : ''}

      ${status === 'rejected' ? `
      <p>Unfortunately, your application did not meet our requirements at this time.</p>
      <p>Reason: Please review your documents and company details.</p>
      <p>You may reapply after making necessary corrections.</p>
      ` : ''}

      ${status === 'under_review' ? `
      <p>Your application is still being reviewed. We will notify you soon.</p>
      ` : ''}

      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br><strong>The betasafar Team</strong></p>
    ${emailFooter()}
  `;
}