// tests/controllers/authController.test.js
const path = require('path');
const { db, dbConfig } = require('../../server/config/db');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const authController = require('../../server/controllers/authController');
const UserModel = require('../../server/models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock('../../server/models/userModel'); // Mock UserModel

describe('AuthController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login user successfully with correct credentials', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';
      const mockCaptchaInput = 'correctCaptcha';
      const mockUserId = 123;
      const mockUserRole = 'admin';
      const mockToken = 'mockToken';

      req.body = { email: mockEmail, password: mockPassword, captchaInput: mockCaptchaInput };
      req.session.captcha = mockCaptchaInput;

      // Mock UserModel.findByEmail and bcrypt.compare
      UserModel.findByEmail.mockResolvedValue({
        user_id: mockUserId,
        user_role: mockUserRole,
        user_password: mockHashedPassword
      });

      // Spy on bcrypt.compare and mock its implementation
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      jwt.sign.mockReturnValue(mockToken);

      // Call the loginUser function
      await authController.loginUser(req, res);

      // Assertions
      expect(UserModel.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcryptCompareSpy).toHaveBeenCalledWith(mockPassword, mockHashedPassword); // Assert on the spy
      expect(res.cookie).toHaveBeenCalled(); // Basic check that cookie is called
      expect(res.json).toHaveBeenCalledWith({
        message: "✅ Login successful!",
        redirectUrl: "/patients"
      });

      bcryptCompareSpy.mockRestore(); // Restore the original implementation
    });
  });
});