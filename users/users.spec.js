const request = require('supertest');
const server = require('../api/server');
const db = require('../data/db-config.js');

describe('GET /api/users', () => {
  it('should return 200 OK with JSON body', async function () {
    const api_response = await request(server).get('/api/users');
    expect(api_response.status).toBe(200);
    expect(api_response.type).toMatch(/json/i);
    expect(api_response.body).toEqual({
      message: 'Welcome to the Users Router! 🐣',
    });
  });
});

const register_test = {
  username: 'hamster4',
  password: 'confetti4',
  email: 'hamster4@gmail.com',
  name: 'Hildegard Hamster 4',
};

const login_test = {
  username: 'hamster4',
  password: 'confetti4',
};

const put_test = {
  username: 'Hamster4',
};

describe('POST api/users/register', () => {
  /*
  beforeEach(() => {
    return db.migrate
      .rollback()
      .then(() => db.migrate.latest())
      .then(() => db.seed.run());
  });
  */
  it('should return status 201', async function () {
    const register_response = await request(server)
      .post('/api/users/register')
      .send(register_test);
    expect(register_response.status).toBe(201);
    expect(register_response.type).toMatch(/json/i);
    const login_response = await request(server)
      .post('/api/users/login')
      .send(login_test);
    expect(login_response.status).toBe(200);
    expect(login_response.type).toMatch(/json/i);
    const put_response = await request(server)
      .put(`/api/users/${register_response.body.id}`)
      .send(put_test)
      .set('authorization', login_response.body.token);
    expect(login_response.status).toBe(200);
    expect(login_response.type).toMatch(/json/i);
  });
});
