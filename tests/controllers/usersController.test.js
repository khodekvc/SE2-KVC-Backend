const request = require('supertest');
const express = require('express');
const session = require('express-session');
const usersController = require('../../../server/controllers/usersController');
const UserModel = require('../../../server/models/userModel');
const { hashPassword, comparePassword } = require('../../../server/utils/passwordUtility');

jest.mock('../../../server/models/userModel');
jest.mock('../../../server/utils/passwordUtility');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

app.put('/users/employee/profile', usersController.updateEmployeeProfile);
app.put('/users/owner/profile', usersController.updateOwnerProfile);
app.post('/users/change-password', usersController.changePassword);

describe('Users Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update employee profile successfully', async () => {
    UserModel.getUserById.mockResolvedValue({
      user_id: 1,
      user_firstname: 'John',
      user_lastname: 'Doe',
      user_email: 'john.doe@example.com',
      user_contact: '1234567890'
    });
    UserModel.updateEmployeeProfile.mockResolvedValue();

    const response = await request(app)
      .put('/users/employee/profile')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        contact: '0987654321'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Employee profile updated successfully!');
  });

  it('should return error if server error occurs while updating employee profile', async () => {
    UserModel.getUserById.mockResolvedValue({
      user_id: 1,
      user_firstname: 'John',
      user_lastname: 'Doe',
      user_email: 'john.doe@example.com',
      user_contact: '1234567890'
    });
    UserModel.updateEmployeeProfile.mockRejectedValue(new Error('Server error'));

    const response = await request(app)
      .put('/users/employee/profile')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        contact: '0987654321'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('❌ Server error while updating profile.');
  });

  it('should update owner profile successfully', async () => {
    UserModel.getUserById.mockResolvedValue({
      user_id: 1,
      user_firstname: 'John',
      user_lastname: 'Doe',
      user_email: 'john.doe@example.com',
      user_contact: '1234567890'
    });
    UserModel.getOwnerByUserId.mockResolvedValue({
      owner_address: '123 Main St',
      owner_alt_person1: 'Jane Doe',
      owner_alt_contact1: '0987654321'
    });
    UserModel.updateOwnerProfile.mockResolvedValue();

    const response = await request(app)
      .put('/users/owner/profile')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        contact: '0987654321',
        address: '456 Elm St',
        altperson: 'John Smith',
        altcontact: '1122334455'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Pet owner profile updated successfully!');
  });

  it('should return error if server error occurs while updating owner profile', async () => {
    UserModel.getUserById.mockResolvedValue({
      user_id: 1,
      user_firstname: 'John',
      user_lastname: 'Doe',
      user_email: 'john.doe@example.com',
      user_contact: '1234567890'
    });
    UserModel.getOwnerByUserId.mockResolvedValue({
      owner_address: '123 Main St',
      owner_alt_person1: 'Jane Doe',
      owner_alt_contact1: '0987654321'
    });
    UserModel.updateOwnerProfile.mockRejectedValue(new Error('Server error'));

    const response = await request(app)
      .put('/users/owner/profile')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        contact: '0987654321',
        address: '456 Elm St',
        altperson: 'John Smith',
        altcontact: '1122334455'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('❌ Server error while updating profile.');
  });

  it('should change password successfully', async () => {
    UserModel.getPasswordById.mockResolvedValue('hashedpassword');
    comparePassword.mockResolvedValue(true);
    hashPassword.mockResolvedValue('newhashedpassword');
    UserModel.updatePassword.mockResolvedValue();

    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'newpassword'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Password changed successfully!');
  });

  it('should return error if current password is incorrect', async () => {
    UserModel.getPasswordById.mockResolvedValue('hashedpassword');
    comparePassword.mockResolvedValue(false);

    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'newpassword'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Incorrect current password.');
  });

  it('should return error if new passwords do not match', async () => {
    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'differentpassword'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ New passwords do not match!');
  });

  it('should return error if required fields are missing when changing password', async () => {
    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      })
      .set('user', { userId: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ All fields are required!');
  });

  it('should return error if user is not logged in when changing password', async () => {
    const response = await request(app)
      .post('/users/change-password')
      .send({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'newpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('❌ Unauthorized. Please log in.');
  });
});