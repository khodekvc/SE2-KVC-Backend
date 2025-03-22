const request = require('supertest');
const express = require('express');
const session = require('express-session');
const recordRoutes = require('../../../server/routes/recordRoutes');
const recordController = require('../../../server/controllers/recordController');
const { authenticate, authorize } = require('../../../server/middleware/authMiddleware');

jest.mock('../../../server/controllers/recordController');
jest.mock('../../../server/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));
app.use('/api', recordRoutes);

describe('Record Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a medical record', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'doctor' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    recordController.addRecord.mockImplementation((req, res) => {
      res.status(201).json({ message: 'Medical record added successfully!' });
    });

    const response = await request(app)
      .post('/api/records/1')
      .send({
        record_date: '2022-01-01',
        record_weight: 10,
        record_temp: 37.5,
        record_condition: 'Healthy',
        record_symptom: 'None',
        lab_description: 'Blood Test',
        diagnosis_text: 'No issues',
        surgery_type: 'Neutering',
        surgery_date: '2022-01-02',
        record_recent_visit: '2022-01-01',
        record_purchase: 'Food',
        record_purpose: 'Checkup'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Medical record added successfully!');
  });

  it('should update a medical record', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'doctor' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    recordController.updateRecord.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Medical record updated successfully!' });
    });

    const response = await request(app)
      .put('/api/records/1')
      .send({
        record_date: '2022-01-02',
        record_weight: 11,
        record_temp: 38,
        record_condition: 'Sick',
        record_symptom: 'Cough',
        lab_description: 'Urine Test',
        diagnosis_text: 'Flu',
        surgery_type: 'Neutering',
        surgery_date: '2022-01-03',
        record_recent_visit: '2022-01-02',
        record_purchase: 'Medicine',
        record_purpose: 'Treatment'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Medical record updated successfully!');
  });

  it('should request diagnosis access code', async () => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 1, role: 'clinician' };
      next();
    });
    authorize.mockImplementation((req, res, next) => {
      next();
    });
    recordController.requestDiagnosisAccessCode.mockImplementation((req, res) => {
      res.status(200).json({ message: '✅ Access code request sent. Await access code from the clinic owner.' });
    });

    const response = await request(app)
      .get('/api/records/request-access-code');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Access code request sent. Await access code from the clinic owner.');
  });
});