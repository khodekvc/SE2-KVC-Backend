const nodemailer = require('nodemailer');
const { sendEmail } = require('../../../server/utils/emailUtility');

jest.mock('nodemailer');

describe('emailUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'password';
  });

  it('should send an email successfully', async () => {
    const mockSendMail = jest.fn().mockResolvedValue({ response: '250 OK' });
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    await sendEmail(to, subject, body);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body,
    });

    expect(console.log).toHaveBeenCalledWith('Email sent:', '250 OK');
  });

  it('should handle errors when sending an email', async () => {
    const mockSendMail = jest.fn().mockRejectedValue(new Error('Failed to send email'));
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    await sendEmail(to, subject, body);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body,
    });

    expect(console.error).toHaveBeenCalledWith('Error sending email:', new Error('Failed to send email'));
  });
});