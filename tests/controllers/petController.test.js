const request = require('supertest');
const express = require('express');
const session = require('express-session');
const petController = require('../../../server/controllers/petController');
const PetModel = require('../../../server/models/petModel');
const dayjs = require('dayjs');

jest.mock('../../../server/models/petModel');
jest.mock('dayjs');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

app.put('/pets/edit/:pet_id', petController.updatePetProfile);
app.put('/pets/archive/:pet_id', petController.archivePet);
app.put('/pets/restore/:pet_id', petController.restorePet);
app.get('/pets/active', petController.getAllActivePets);
app.get('/pets/archived', petController.getAllArchivedPets);

describe('Pet Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update pet profile successfully', async () => {
    PetModel.findById.mockResolvedValue({ pet_id: 1, pet_birthday: '2020-01-01' });
    PetModel.updatePet.mockResolvedValue({ affectedRows: 1 });
    dayjs.mockImplementation(() => ({
      isValid: () => true,
      diff: (date, unit) => (unit === 'year' ? 2 : 24),
    }));

    const response = await request(app)
      .put('/pets/edit/1')
      .send({
        pet_birthday: '2020-01-01',
        pet_age_year: 2,
        pet_age_month: 0,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Pet profile updated successfully!');
  });

  it('should return error if pet not found during update', async () => {
    PetModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .put('/pets/edit/1')
      .send({
        pet_birthday: '2020-01-01',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('❌ Pet not found.');
  });

  it('should return error if age mismatch during update', async () => {
    PetModel.findById.mockResolvedValue({ pet_id: 1, pet_birthday: '2020-01-01' });
    dayjs.mockImplementation(() => ({
      isValid: () => true,
      diff: (date, unit) => (unit === 'year' ? 2 : 24),
    }));

    const response = await request(app)
      .put('/pets/edit/1')
      .send({
        pet_birthday: '2020-01-01',
        pet_age_year: 3,
        pet_age_month: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('❌ Age mismatch! The computed age based on birthday is 2 years and 0 months.');
  });

  it('should archive pet successfully', async () => {
    PetModel.findById.mockResolvedValue({ pet_id: 1, pet_name: 'Buddy' });
    PetModel.archivePet.mockResolvedValue();

    const response = await request(app)
      .put('/pets/archive/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Pet Buddy archived successfully!');
  });

  it('should return error if pet not found during archiving', async () => {
    PetModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .put('/pets/archive/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('❌ Pet not found!');
  });

  it('should restore pet successfully', async () => {
    PetModel.findById.mockResolvedValue({ pet_id: 1, pet_name: 'Buddy' });
    PetModel.restorePet.mockResolvedValue();

    const response = await request(app)
      .put('/pets/restore/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('✅ Pet Buddy restored successfully!');
  });

  it('should return error if pet not found during restoring', async () => {
    PetModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .put('/pets/restore/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('❌ Pet not found!');
  });

  it('should fetch all active pets successfully', async () => {
    const mockPets = [{ pet_id: 1, pet_name: 'Buddy', pet_status: 'active' }];
    PetModel.getAllActivePets.mockResolvedValue(mockPets);

    const response = await request(app)
      .get('/pets/active');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPets);
  });

  it('should fetch all archived pets successfully', async () => {
    const mockPets = [{ pet_id: 1, pet_name: 'Buddy', pet_status: 'archived' }];
    PetModel.getAllArchivedPets.mockResolvedValue(mockPets);

    const response = await request(app)
      .get('/pets/archived');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPets);
  });
});