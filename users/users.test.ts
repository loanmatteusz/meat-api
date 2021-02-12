import 'jest';
import * as request from 'supertest';

let adress: string = `http://localhost:3001`;

test('get /users', () => {
  return request(adress)
    .get('/users')
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test('post /users', () => {
  return request(adress)
    .post('/users')
    .send({
      name: 'user1',
      email: 'user@gmail.com',
      password: '12345',
      cpf: '962.116.531-82'
    })
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe('user1');
      expect(response.body.email).toBe('user@gmail.com');
      expect(response.body.password).toBeUndefined();
      expect(response.body.cpf).toBe('962.116.531-82');
    })
    .catch(fail);
});

test('get /users/aaaaa - not found', () => {
  return request(adress)
    .get('/users/aaaaa')
    .then(response => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test('patch /users/:id', () => {
  return request(adress)
    .post('/users')
    .send({
      name: 'user02',
      email: 'user02@gmail.com',
      password: '12345'
    })
    .then(response => {
      return request(adress)
        .patch(`/users/${response.body._id}`)
        .send({
          name: 'user02 - patch'
        })
    })
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe('user02 - patch');
      expect(response.body.email).toBe('user02@gmail.com');
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});
