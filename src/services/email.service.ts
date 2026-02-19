import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendTestEmail(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'CAP System - Test Email',
      html: '<p>This is a test email from CAP System. Email service is working correctly!</p>',
    });
  }

  async sendAssessmentAssignmentEmail(participants: string[], assessmentDetails: {
    name: string;
    description: string;
    controlName: string;
    priority: string;
    dueDate: number;
  }): Promise<boolean> {
    const dueDate = new Date(assessmentDetails.dueDate * 1000).toLocaleDateString();
    
    return this.sendEmail({
      to: participants,
      subject: `New Assessment Assignment - ${assessmentDetails.name}`,
      html: `
        <h2>You have been assigned to a new assessment</h2>
        <p><strong>Assessment:</strong> ${assessmentDetails.name}</p>
        <p><strong>Description:</strong> ${assessmentDetails.description}</p>
        <p><strong>Control:</strong> ${assessmentDetails.controlName}</p>
        <p><strong>Priority:</strong> ${assessmentDetails.priority.toUpperCase()}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <p>Please log in to the CAP system to view and complete your assignment.</p>
      `,
    });
  }
}

export default new EmailService();