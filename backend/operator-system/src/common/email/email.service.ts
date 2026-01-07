// src/common/email/email.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

// All email templates imported at the top
import welcomeEmail from '../../emails/templates/welcomeEmail';
import verificationUpdateEmail from '../../emails/templates/verificationUpdateEmail';
import newBookingEmail from '../../emails/templates/newBookingEmail';
import payoutRequestEmail from '../../emails/templates/payoutRequestEmail';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not found in environment');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'no-reply@betasafar.app';
    this.fromName = this.configService.get<string>('RESEND_FROM_NAME') || 'betasafar Platform';
  }

  private async send(html: string, to: string | string[], subject: string, text?: string) {
    try {
      const data = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      });

      return data;
    } catch (error) {
      console.error('Resend email error:', error);
      throw new BadRequestException('Failed to send email');
    }
  }

  async sendWelcomeEmail(to: string, companyName: string) {
    const html = welcomeEmail(companyName);
    return this.send(
      html,
      to,
      'Welcome to betasafar Platform!',
      `Welcome, ${companyName}! Your account is under review.`,
    );
  }

  async sendVerificationUpdateEmail(
    to: string,
    companyName: string,
    status: 'approved' | 'rejected' | 'under_review',
  ) {
    const html = verificationUpdateEmail(companyName, status);
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    return this.send(html, to, `Account Verification: ${statusText}`, `Your account has been ${status}.`);
  }

  async sendNewBookingEmail(
    to: string,
    data: {
      companyName: string;
      bookingId: number;
      pilgrimName: string;
      packageTitle: string;
      numberOfPilgrims: number;
      totalAmount: number;
    },
  ) {
    const html = newBookingEmail(data);
    return this.send(html, to, 'New Booking Received!', `You have a new booking #${data.bookingId}`);
  }

  async sendPayoutRequestEmail(to: string, companyName: string, amount: number, requestId: number) {
    const html = payoutRequestEmail(companyName, amount, requestId);
    return this.send(
      html,
      to,
      'Payout Request Submitted',
      `Your payout request for ₦${amount.toLocaleString()} has been received.`,
    );
  }
}