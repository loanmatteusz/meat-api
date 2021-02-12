import 'jest';
import * as request from 'supertest';

let adress: string = (<any>global).adress;

test('get /reviews', () => {
  return request(adress)
    .get('/reviews')
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});