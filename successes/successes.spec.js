const request = require('supertest');
const server = require('../api/server');

describe('GET /api/successes', () => {
  it('should return 200 OK with JSON body', async function () {
    const api_response = await request(server).get('/api/successes');
    expect(api_response.status).toBe(200);
    expect(api_response.type).toMatch(/json/i);
    expect(api_response.body).toEqual({
      message: 'Welcome to the Successes Router! 🏆',
    });
  });
});
