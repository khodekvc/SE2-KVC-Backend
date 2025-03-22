const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../../../server/routes/authRoutes');
const authController = require('../../../server/controllers/authController');
const { authenticate } = require('../../../server/middleware/authMiddleware');

jest.mock('../../../server/controllers/authController');
jest.mock('../../../server/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify CAPTCHA successfully', async () => {
    const captchaResponse = 'testcaptcha';
    const session = { captcha: 'testcaptcha' };

    const response = await request(app)
      .post('/auth/captcha/verify')
      .send({ captchaResponse })
      .set('Cookie', [`connect.sid=${JSON.stringify(session)}`]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ CAPTCHA verified!');
  });

  it('should return error if CAPTCHA response is missing', async () => {
    const response = await request(app)
      .post('/auth/captcha/verify')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing CAPTCHA response.');
  });

  it('should return error if session CAPTCHA is missing', async () => {
    const captchaResponse = 'testcaptcha';

    const response = await request(app)
      .post('/auth/captcha/verify')
      .send({ captchaResponse });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Session expired. Please refresh CAPTCHA.');
  });

  it('should return error if CAPTCHA response is incorrect', async () => {
    const captchaResponse = 'wrongcaptcha';
    const session = { captcha: 'testcaptcha' };

    const response = await request(app)
      .post('/auth/captcha/verify')
      .send({ captchaResponse })
      .set('Cookie', [`connect.sid=${JSON.stringify(session)}`]);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Incorrect CAPTCHA!');
  });

  it('should generate CAPTCHA', async () => {
    authController.getCaptcha.mockImplementation((req, res) => {
      res.json({ captcha: 'generatedcaptcha' });
    });

    const response = await request(app).get('/auth/captcha');

    expect(response.status).toBe(200);
    expect(response.body.captcha).toBe('generatedcaptcha');
  });

  it('should login user', async () => {
    authController.loginUser.mockImplementation((req, res) => {
      res.json({ message: 'Login successful' });
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should sign up pet owner step 1', async () => {
    authController.signupPetOwnerStep1.mockImplementation((req, res) => {
      res.json({ message: 'Step 1 completed' });
    });

    const response = await request(app)
      .post('/auth/signup/petowner-step1')
      .send({
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        contact: '1234567890',
        address: '123 Main St',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Step 1 completed');
  });

  it('should sign up pet owner step 2', async () => {
    authController.signupPetOwnerStep2.mockImplementation((req, res) => {
      res.json({ message: 'Pet Owner account created successfully' });
    });

    const response = await request(app)
      .post('/auth/signup/petowner-step2')
      .send({
        petname: 'Buddy',
        gender: 'Male',
        species: 'Dog',
        breed: 'Labrador',
        birthdate: '2020-01-01',
        captchaInput: 'captcha'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Pet Owner account created successfully');
  });

  it('should request employee signup', async () => {
    authController.signupEmployeeRequest.mockImplementation((req, res) => {
      res.json({ message: 'Signup request sent' });
    });

    const response = await request(app)
      .post('/auth/signup/employee')
      .send({
        fname: 'Jane',
        lname: 'Doe',
        email: 'jane.doe@example.com',
        role: 'Vet',
        password: 'password123',
        confirmPassword: 'password123',
        captchaInput: 'captcha'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Signup request sent');
  });

  it('should complete employee signup', async () => {
    authController.signupEmployeeComplete.mockImplementation((req, res) => {
      res.json({ message: 'Signup successful' });
    });

    const response = await request(app)
      .post('/auth/signup/employee-verify')
      .send({ accessCode: 'ACCESSCODE' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Signup successful');
  });

  it('should logout user', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'user' };
      next();
    });
    authController.logoutUser.mockImplementation((req, res) => {
      res.json({ message: 'Logout successful' });
    });

    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});