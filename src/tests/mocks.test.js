const request = require('supertest');
const app = require('../app.js'); 
const { connectDB, mongoose } = require('../config/database');
const User = require('../models/user.js');
const Pet = require('../models/pet.js');

beforeAll(async () => {
  await connectDB('mongodb://localhost:27017/mockTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Mock Routes', () => {
  it('GET /api/mocks/mockingusers debe generar 50 usuarios', async () => {
    const res = await request(app).get('/api/mocks/mockingusers');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.payload.length).toBe(50);
    expect(res.body.payload[0]).toHaveProperty('first_name');
    expect(res.body.payload[0]).toHaveProperty('password');
  });

  it('POST /api/mocks/generateData debe insertar usuarios y mascotas', async () => {
    const res = await request(app).post('/api/mocks/generateData?users=5&pets=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');

    const usersInDb = await User.find();
    const petsInDb = await Pet.find();
    expect(usersInDb.length).toBe(5);
    expect(petsInDb.length).toBe(3);
  });
});