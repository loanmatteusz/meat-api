import 'jest';
import * as request from 'supertest';

import { Server } from '../server/server';
import { environment } from '../common/environment';
import { usersRouter } from './users.router';
import { User } from './users.model';


let adress: string;
let server: Server;
beforeAll(() => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
  environment.server.port = process.env.SERVER_PORT || 3001;
  adress = `http://localhost:${environment.server.port}`;
  server = new Server();
  return server.bootstrap([usersRouter])
    .then(_ => User.remove({}).exec())
    .catch(console.error);
});

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

test('path /users/:id', () => {
  return request(adress)
    .post('/users')
    .then()
});

afterAll(() => {
  return server.shutdown();
});
