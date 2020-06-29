const request = require('supertest');
const server = require('./server');

describe('API server', () => {
  it('runs the test', () => {
    expect(true).toBe(true);
  });
  it('should return 200 OK with JSON body', async function () {
    const api_response = await request(server).get('/api');
    expect(api_response.status).toBe(200);
    expect(api_response.type).toMatch(/json/i);
    expect(api_response.body).toEqual({
      message: `API is up and running. 🏃‍♀️`,
    });
  });
});
