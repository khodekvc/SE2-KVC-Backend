const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authController = require('../../../server/controllers/authController');
const UserModel = require('../../../server/models/userModel');
const PetModel = require('../../../server/models/petModel');
const { generateCaptcha, generateCaptchaImage } = require('../../../server/utils/captchaUtility');
const { hashPassword } = require('../../../server/utils/passwordUtility');
const { generateToken } = require('../../../server/utils/authUtility');
const { sendEmail } = require('../../../server/utils/emailUtility');

jest.mock('../../../server/models/userModel');
jest.mock('../../../server/models/petModel');
jest.mock('../../../server/utils/captchaUtility');
jest.mock('../../../server/utils/passwordUtility');
jest.mock('../../../server/utils/authUtility');
jest.mock('../../../server/utils/emailUtility');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

app.post('/login', authController.loginUser);
app.post('/signup/petowner-step1', authController.signupPetOwnerStep1);
app.post('/signup/petowner-step2', authController.signupPetOwnerStep2);
app.post('/signup/employee', authController.signupEmployeeRequest);
app.post('/signup/employee-verify', authController.signupEmployeeComplete);
app.post('/logout', authController.logoutUser);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login user successfully', async () => {
    UserModel.findByEmail.mockResolvedValue({
      user_id: 1,
      user_password: 'hashedpassword',
      user_role: 'user'
    });
    const bcrypt = require('bcrypt');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    generateToken.mockReturnValue('token');

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
        captchaInput: 'captcha'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Login successful!');
  });

  it('should return error if CAPTCHA is incorrect during login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
        captchaInput: 'wrongcaptcha'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Incorrect CAPTCHA');
  });

  it('should sign up pet owner step 1 successfully', async () => {
    UserModel.isEmailTaken.mockResolvedValue(false);
    hashPassword.mockResolvedValue('hashedpassword');

    const response = await request(app)
      .post('/signup/petowner-step1')
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
    expect(response.body.message).toBe('✅ Step 1 completed. Proceed to pet info.');
  });

  it('should return error if required fields are missing in pet owner step 1', async () => {
    const response = await request(app)
      .post('/signup/petowner-step1')
      .send({
        fname: '',
        lname: '',
        email: '',
        contact: '',
        address: '',
        password: '',
        confirmPassword: ''
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ All fields are required!');
  });

  it('should sign up pet owner step 2 successfully', async () => {
    UserModel.createPetOwner.mockResolvedValue(1);
    PetModel.createPet.mockResolvedValue();
    generateToken.mockReturnValue('token');

    const response = await request(app)
      .post('/signup/petowner-step2')
      .send({
        petname: 'Buddy',
        gender: 'Male',
        species: 'Dog',
        breed: 'Labrador',
        birthdate: '2020-01-01',
        captchaInput: 'captcha'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('✅ Pet Owner account created successfully!');
  });

  it('should return error if CAPTCHA is incorrect during pet owner step 2', async () => {
    const response = await request(app)
      .post('/signup/petowner-step2')
      .send({
        petname: 'Buddy',
        gender: 'Male',
        species: 'Dog',
        breed: 'Labrador',
        birthdate: '2020-01-01',
        captchaInput: 'wrongcaptcha'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Incorrect CAPTCHA!');
  });

  it('should request employee signup successfully', async () => {
    UserModel.findByEmail.mockResolvedValue(null);
    sendEmail.mockResolvedValue();

    const response = await request(app)
      .post('/signup/employee')
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
    expect(response.body.message).toBe('✅ Signup request sent. Await access code from the clinic owner.');
  });

  it('should complete employee signup successfully', async () => {
    hashPassword.mockResolvedValue('hashedpassword');
    UserModel.createEmployee.mockResolvedValue(1);
    generateToken.mockReturnValue('token');

    const response = await request(app)
      .post('/signup/employee-verify')
      .send({
        accessCode: 'ACCESSCODE'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Signup successful! You can now log in.');
  });

  it('should return error if access code is missing during employee signup completion', async () => {
    const response = await request(app)
      .post('/signup/employee-verify')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Access code is required!');
  });

  it('should logout user successfully', async () => {
    const response = await request(app)
      .post('/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});