const request = require('supertest');
const express = require('express');
const session = require('express-session');
const recordController = require('../../../server/controllers/recordController');
const {
  insertDiagnosis, insertSurgeryInfo, insertRecord, insertMatchRecLab,
  getLabIdByDescription, updateRecordInDB, updateMatchRecLab, getRecordById, updateDiagnosisText
} = require('../../../server/models/recordModel');
const { sendEmail } = require('../../../server/utils/emailUtility');
const crypto = require('crypto');

jest.mock('../../../server/models/recordModel');
jest.mock('../../../server/utils/emailUtility');
jest.mock('crypto');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

app.post('/records', recordController.addRecord);
app.put('/records/:recordId', recordController.updateRecord);
app.post('/records/request-access-code', recordController.requestDiagnosisAccessCode);

describe('Record Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a medical record successfully', async () => {
    getLabIdByDescription.mockResolvedValue(1);
    insertDiagnosis.mockResolvedValue(1);
    insertSurgeryInfo.mockResolvedValue(1);
    insertRecord.mockResolvedValue(1);
    insertMatchRecLab.mockResolvedValue();

    const response = await request(app)
      .post('/records')
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
      })
      .set('user', { role: 'doctor' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Medical record added successfully!');
  });

  it('should return error if required fields are missing when adding a record', async () => {
    const response = await request(app)
      .post('/records')
      .send({
        record_date: '2022-01-01',
        record_weight: 10,
        record_temp: 37.5,
        record_condition: 'Healthy',
        record_symptom: 'None',
        record_recent_visit: '2022-01-01',
        record_purchase: 'Food',
        record_purpose: 'Checkup'
      })
      .set('user', { role: 'doctor' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields.');
  });

  it('should return error if clinician tries to add a diagnosis', async () => {
    const response = await request(app)
      .post('/records')
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
      })
      .set('user', { role: 'clinician' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Clinicians cannot add a diagnosis when creating a record.');
  });

  it('should update a medical record successfully', async () => {
    getRecordById.mockResolvedValue({
      record_id: 1,
      record_date: '2022-01-01',
      record_weight: 10,
      record_temp: 37.5,
      record_condition: 'Healthy',
      record_symptom: 'None',
      lab_id: 1,
      diagnosis_id: 1,
      surgery_id: 1,
      record_lab_file: null
    });
    getLabIdByDescription.mockResolvedValue(1);
    updateRecordInDB.mockResolvedValue();
    updateDiagnosisText.mockResolvedValue();

    const response = await request(app)
      .put('/records/1')
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
      })
      .set('user', { role: 'doctor' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Medical record updated successfully!');
  });

  it('should return error if record not found during update', async () => {
    getRecordById.mockResolvedValue(null);

    const response = await request(app)
      .put('/records/1')
      .send({
        record_date: '2022-01-02',
      })
      .set('user', { role: 'doctor' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Record not found.');
  });

  it('should return error if clinician tries to update a diagnosis without access code', async () => {
    getRecordById.mockResolvedValue({
      record_id: 1,
      record_date: '2022-01-01',
      record_weight: 10,
      record_temp: 37.5,
      record_condition: 'Healthy',
      record_symptom: 'None',
      lab_id: 1,
      diagnosis_id: 1,
      surgery_id: 1,
      record_lab_file: null
    });

    const response = await request(app)
      .put('/records/1')
      .send({
        diagnosis_text: 'Flu',
      })
      .set('user', { role: 'clinician' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Clinicians need a valid access code to update a diagnosis.');
  });

  it('should request diagnosis access code successfully', async () => {
    crypto.randomBytes.mockReturnValue(Buffer.from('abcd1234'));
    sendEmail.mockResolvedValue();

    const response = await request(app)
      .post('/records/request-access-code')
      .set('user', { role: 'clinician' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Access code request sent. Await access code from the clinic owner.');
  });

  it('should return error if session is not initialized during access code request', async () => {
    const response = await request(app)
      .post('/records/request-access-code')
      .set('user', { role: 'clinician' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('❌ Session is not initialized.');
  });
});