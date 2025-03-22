const request = require('supertest');
const express = require('express');
const session = require('express-session');
const petRoutes = require('../../../server/routes/petRoutes');
const petController = require('../../../server/controllers/petController');
const { authenticate, authorize } = require('../../../server/middleware/authMiddleware');

jest.mock('../../../server/controllers/petController');
jest.mock('../../../server/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));
app.use('/pets', petRoutes);

describe('Pet Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update pet profile', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'clinician' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    petController.updatePetProfile.mockImplementation((req, res) => {
      res.json({ message: 'Pet profile updated successfully' });
    });

    const response = await request(app)
      .put('/pets/edit/1')
      .send({
        pet_name: 'Buddy',
        pet_species: 'Dog',
        pet_breed: 'Labrador',
        pet_gender: 'Male',
        pet_birthday: '2020-01-01',
        pet_color: 'Yellow',
        pet_status: 'active'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pet profile updated successfully');
  });

  it('should archive pet', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'clinician' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    petController.archivePet.mockImplementation((req, res) => {
      res.json({ message: 'Pet archived successfully' });
    });

    const response = await request(app).put('/pets/archive/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pet archived successfully');
  });

  it('should restore pet', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'clinician' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    petController.restorePet.mockImplementation((req, res) => {
      res.json({ message: 'Pet restored successfully' });
    });

    const response = await request(app).put('/pets/restore/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pet restored successfully');
  });

  it('should get all active pets', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'user' };
      next();
    });
    petController.getAllActivePets.mockImplementation((req, res) => {
      res.json([{ pet_id: 1, pet_name: 'Buddy', pet_status: 'active' }]);
    });

    const response = await request(app).get('/pets/active');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ pet_id: 1, pet_name: 'Buddy', pet_status: 'active' }]);
  });

  it('should get all archived pets', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'user' };
      next();
    });
    petController.getAllArchivedPets.mockImplementation((req, res) => {
      res.json([{ pet_id: 1, pet_name: 'Buddy', pet_status: 'archived' }]);
    });

    const response = await request(app).get('/pets/archived');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ pet_id: 1, pet_name: 'Buddy', pet_status: 'archived' }]);
  });
});