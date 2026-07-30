import axios from 'axios';
import { env } from '../../config/env';

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

export async function sendPasswordResetEmail(toEmail: string, resetLink: string, userName: string): Promise<boolean> {
  if (!env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured — skipping email send');
    return false;
  }

  try {
    await axios.post(BREVO_API, {
      sender: { email: env.BREVO_FROM_EMAIL, name: env.BREVO_FROM_NAME },
      to: [{ email: toEmail, name: userName }],
      subject: 'Password Reset - CIMS',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
            <h2 style="color: #1e293b; margin: 0 0 8px;">Password Reset</h2>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">Hi ${userName},</p>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new one.</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetLink}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Reset Password</a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">If you didn't request this, you can safely ignore this email. The link expires in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} CIMS. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    }, {
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return true;
  } catch (err: any) {
    console.error('Brevo send failed:', err.response?.data || err.message);
    return false;
  }
}
