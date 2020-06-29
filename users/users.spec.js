const request = require('supertest');
const server = require('../api/server');

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
