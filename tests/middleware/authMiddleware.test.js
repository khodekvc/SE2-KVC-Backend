const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../../../server/middleware/authMiddleware');

jest.mock('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
});

app.get('/admin', authenticate, authorize({ roles: ['admin'] }), (req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});

app.post('/forgetPasswordChange', (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword === confirmPassword) {
    // temp
    const users = [{ email: 'user@example.com', password: 'oldPassword' }];
    const user = users.find(user => user.email === email);
    if (user) {
      user.password = newPassword;
      return res.status(200).json({ message: 'Password changed successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } else {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should return 500 if JWT_SECRET is missing', async () => {
    delete process.env.JWT_SECRET;

    const response = await request(app).get('/protected');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('❌ Server error. Missing JWT_SECRET.');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Unauthorized: No token provided.');
  });

  it('should return 401 if token is expired', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback({ name: 'TokenExpiredError' }, null);
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=expiredtoken');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Unauthorized: Token expired. Please log in again.');
  });

  it('should return 401 if token is invalid', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Unauthorized: Invalid token.');
  });

  it('should grant access if token is valid', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 1, role: 'user' });
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=validtoken');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
  });

  it('should return 403 if user does not have the required role', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 1, role: 'user' });
    });

    const response = await request(app)
      .get('/admin')
      .set('Cookie', 'token=validtoken');
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('❌ Forbidden: You do not have the required role.');
  });

  it('should grant access if user has the required role', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 1, role: 'admin' });
    });

    const response = await request(app)
      .get('/admin')
      .set('Cookie', 'token=admintoken');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admin access granted');
  });

  it('should change password successfully if passwords match', async () => {
    const response = await request(app)
      .post('/forgetPasswordChange')
      .send({
        email: 'user@example.com',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password changed successfully');
  });

  it('should return 404 if user is not found during password change', async () => {
    const response = await request(app)
      .post('/forgetPasswordChange')
      .send({
        email: 'nonexistent@example.com',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 400 if passwords do not match during password change', async () => {
    const response = await request(app)
      .post('/forgetPasswordChange')
      .send({
        email: 'user@example.com',
        newPassword: 'newPassword',
        confirmPassword: 'differentPassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Passwords do not match');
  });
});