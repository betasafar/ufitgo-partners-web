import { emailHeader } from '../components/header';
import { emailFooter } from '../components/footer';

export default function welcomeEmail(companyName: string) {
  return `
    ${emailHeader('Welcome to betasafar!')}
      <h1>Hello ${companyName || 'Valued Partner'},</h1>
      <p>Thank you for registering as an operator on <strong>betasafar Platform</strong>!</p>
      <p>Your account has been created successfully.</p>
      <p>Our team is currently reviewing your documents and company details. You will receive another email once your account is approved.</p>
      <p style="text-align: center;">
        <a href="https://operator.betasafar.app/login" class="button">Go to Dashboard</a>
      </p>
      <p>We look forward to partnering with you to serve pilgrims with excellence.</p>
      <p>Best regards,<br><strong>The betasafar Team</strong></p>
    ${emailFooter()}
  `;
}
