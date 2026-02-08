import { Request, Response } from 'express';
import emailService from '../services/email.service';

const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const success = await emailService.sendTestEmail(email);
    
    if (success) {
      res.json({ message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send test email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export default {
  sendTestEmail,
};