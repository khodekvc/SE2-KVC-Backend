const request = require('supertest');
const express = require('express');
const session = require('express-session');
const vaccineRoutes = require('../../../server/routes/vaccineRoutes');
const vaccineController = require('../../../server/controllers/vaccineController');
const { authenticate, authorize } = require('../../../server/middleware/authMiddleware');

jest.mock('../../../server/controllers/vaccineController');
jest.mock('../../../server/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));
app.use('/api', vaccineRoutes);

describe('Vaccine Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a pet vaccination record', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'doctor' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    vaccineController.addPetVaccinationRecord.mockImplementation((req, res) => {
      res.status(201).json({ message: '✅ Vaccination record added successfully!' });
    });

    const response = await request(app)
      .post('/api/pets/1/vaccines')
      .send({
        vax_type: 'Rabies',
        imm_rec_quantity: 1,
        imm_rec_date: '2022-01-01'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('✅ Vaccination record added successfully!');
  });

  it('should return error if required fields are missing', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'doctor' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    vaccineController.addPetVaccinationRecord.mockImplementation((req, res) => {
      res.status(400).json({ error: '❌ Vaccine type and dose quantity are required.' });
    });

    const response = await request(app)
      .post('/api/pets/1/vaccines')
      .send({
        vax_type: 'Rabies'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Vaccine type and dose quantity are required.');
  });

  it('should return error if vaccine type is invalid', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'doctor' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    vaccineController.addPetVaccinationRecord.mockImplementation((req, res) => {
      res.status(400).json({ error: '❌ Invalid vaccine type. Please select a valid vaccine.' });
    });

    const response = await request(app)
      .post('/api/pets/1/vaccines')
      .send({
        vax_type: 'InvalidVaccine',
        imm_rec_quantity: 1,
        imm_rec_date: '2022-01-01'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Invalid vaccine type. Please select a valid vaccine.');
  });
});