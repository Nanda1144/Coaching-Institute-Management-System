import axios from 'axios';
import { env } from '../../config/env';

const EMAILJS_API = 'https://api.emailjs.com/api/v1.0/email/send';

export async function sendPasswordResetEmail(toEmail: string, resetLink: string, userName: string): Promise<boolean> {
  if (!env.EMAILJS_SERVICE_ID || !env.EMAILJS_TEMPLATE_ID || !env.EMAILJS_USER_ID) {
    console.warn('EmailJS not configured — skipping email send');
    return false;
  }

  try {
    await axios.post(EMAILJS_API, {
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_USER_ID,
      accessToken: env.EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        to_email: toEmail,
        to_name: userName,
        reset_link: resetLink,
        subject: 'Password Reset - CIMS',
      },
    });
    return true;
  } catch (err: any) {
    console.error('EmailJS send failed:', err.response?.data || err.message);
    return false;
  }
}
