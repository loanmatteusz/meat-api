import 'jest';
import * as request from 'supertest';

let adress: string = 'http://localhost:3001';

test('get /reviews', () => {
  return request(adress)
    .get('/reviews')
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});