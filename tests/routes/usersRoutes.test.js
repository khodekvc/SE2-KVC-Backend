const request = require('supertest');
const express = require('express');
const session = require('express-session');
const usersRoutes = require('../../../server/routes/usersRoutes');
const usersController = require('../../../server/controllers/usersController');
const { authenticate } = require('../../../server/middleware/authMiddleware');

jest.mock('../../../server/controllers/usersController');
jest.mock('../../../server/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));
app.use('/users', usersRoutes);

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update employee profile', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1 };
      next();
    });
    usersController.updateEmployeeProfile.mockImplementation((req, res) => {
      res.json({ message: '✅ Employee profile updated successfully!' });
    });

    const response = await request(app)
      .put('/users/update-employee-profile')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        contact: '0987654321'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Employee profile updated successfully!');
  });

  it('should update pet owner profile', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1 };
      next();
    });
    usersController.updateOwnerProfile.mockImplementation((req, res) => {
      res.json({ message: '✅ Pet owner profile updated successfully!' });
    });

    const response = await request(app)
      .put('/users/update-petowner-profile')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        contact: '1234567890',
        address: '456 Elm St',
        altperson: 'Jane Doe',
        altcontact: '1122334455'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Pet owner profile updated successfully!');
  });

  it('should change password', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1 };
      next();
    });
    usersController.changePassword.mockImplementation((req, res) => {
      res.json({ message: '✅ Password changed successfully!' });
    });

    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'newpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Password changed successfully!');
  });
});