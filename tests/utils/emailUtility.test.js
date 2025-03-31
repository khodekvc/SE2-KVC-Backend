// tests/utils/emailUtility.test.js

// **** MOST IMPORTANT CHANGE: Mock nodemailer BEFORE importing sendEmail ****
jest.mock('nodemailer'); // Jest hoists this call automatically

// Now import the function to test (it will get the mocked nodemailer)
const { sendEmail } = require('../../server/utils/emailUtility'); // Adjust path if necessary

// Import the mocked nodemailer module *after* jest.mock to configure it
const nodemailer = require('nodemailer');

// --- Configure the Mock ---
// We need a mock sendMail function that we can inspect
const mockSendMail = jest.fn();

// Configure the mock implementation (this now affects the mocked nodemailer)
// Ensure this configuration happens *after* jest.mock and require('nodemailer')
nodemailer.createTransport.mockReturnValue({
    // Provide a mock sendMail implementation for the transporter
    sendMail: mockSendMail
});
// --- End Mock Configuration ---


// --- Test Suite ---
describe('sendEmail Function', () => {
    // Store original environment variables
    const originalEnv = process.env;

    // Define test variables
    const testTo = 'recipient@example.com';
    const testSubject = 'Test Subject';
    const testBody = 'This is the test email body.';
    const testUser = 'testuser@gmail.com';
    const testPass = 'testpassword';

    // Before each test, reset mocks and environment variables
    beforeEach(() => {
        // Reset call counts and arguments for mocks
        mockSendMail.mockClear();
        nodemailer.createTransport.mockClear(); // Clear the mock transport function too

        // Reset process.env to a clean state for each test
        process.env = { ...originalEnv };

        // Set the required environment variables for most tests
        process.env.EMAIL_USER = testUser;
        process.env.EMAIL_PASS = testPass;
    });

    // After all tests, restore original environment variables
    afterAll(() => {
        process.env = originalEnv;
    });

    // --- Test Cases (No changes needed inside the tests themselves) ---

    test('should call createTransport with correct service and auth', async () => {
        // Make sendMail resolve successfully
        mockSendMail.mockResolvedValue({ response: '250 OK: Mock success' });

        await sendEmail(testTo, testSubject, testBody);

        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1); // Should now be called
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: {
                user: testUser,
                pass: testPass,
            },
        });
        expect(mockSendMail).toHaveBeenCalledTimes(1); // Also check sendMail was called
    });

    test('should call sendMail with correct mail options', async () => {
        mockSendMail.mockResolvedValue({ response: '250 OK: Mock success' });

        await sendEmail(testTo, testSubject, testBody);

        expect(mockSendMail).toHaveBeenCalledTimes(1); // Should now be called
        expect(mockSendMail).toHaveBeenCalledWith({
            from: `"Your Clinic" <${testUser}>`,
            to: testTo,
            subject: testSubject,
            text: testBody,
        });
        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1); // Check transport was called
    });

    test('should log success message when email sends successfully', async () => {
        const mockInfo = { response: 'mock-success-response-id' };
        mockSendMail.mockResolvedValue(mockInfo);

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await sendEmail(testTo, testSubject, testBody);

        expect(mockSendMail).toHaveBeenCalledTimes(1); // Ensure sendMail was called
        expect(consoleSpy).toHaveBeenCalledWith("Email sent:", mockInfo.response); // Should now be called

        consoleSpy.mockRestore();
    });

    test('should log error and not call transporter if EMAIL_USER is missing', async () => {
        delete process.env.EMAIL_USER;

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sendEmail(testTo, testSubject, testBody);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error sending email: EMAIL_USER or EMAIL_PASS environment variables not set."
        );
        // These expectations should remain the same (not called)
        expect(nodemailer.createTransport).not.toHaveBeenCalled();
        expect(mockSendMail).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test('should log error and not call transporter if EMAIL_PASS is missing', async () => {
        delete process.env.EMAIL_PASS;

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sendEmail(testTo, testSubject, testBody);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error sending email: EMAIL_USER or EMAIL_PASS environment variables not set."
        );
         // These expectations should remain the same (not called)
        expect(nodemailer.createTransport).not.toHaveBeenCalled();
        expect(mockSendMail).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test('should log error if sendMail fails (rejects)', async () => {
        const testError = new Error('Mock sendMail failure');
        mockSendMail.mockRejectedValue(testError); // Simulate sendMail throwing an error

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await sendEmail(testTo, testSubject, testBody);

        // Ensure createTransport WAS called
        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1); // Should now be called
        // Ensure sendMail WAS called (and subsequently rejected)
        expect(mockSendMail).toHaveBeenCalledTimes(1); // Should now be called

        // Check that the error was caught and logged
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error sending email:", testError); // Should now be called with the specific mock error

        consoleErrorSpy.mockRestore();
    });
});