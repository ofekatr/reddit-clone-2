import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../server';

chai.use(chaiHttp);

// Assertion style
chai.should();

describe('POST /api/auth/login', () => {
  it('Should login successfully', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ username: 'dvir', password: '123456' })
      .end((_, response) => {
        response.should.have.status(200);
        response.body.should.have.property('token');
        response.body.should.have.property('user');
        done();
      });
  });

  it('Should fail logging in - invalid password.', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({ username: 'dvir', password: '5555555' })
      .end((err, response) => {
        const { body } = response;
        response.should.have.status(401);
        Object.keys(body).should.have.lengthOf(1);
        response.should.have.property('error');
        done();
      });
  });
});

describe('POST /api/auth/register', () => {

  it('Should fail registering - invalid email', (done) => {
    chai.request(server)
    .post('/api/auth/register')
    .send({ username: 'issa', password: '123456', email: 'issa.com' })
    .end((_, response) => {
      const { body } = response;
      response.should.have.status(400);
      Object.keys(body).should.have.lengthOf(1);
      response.should.have.property('error');
      done();
    });
  });

  it('Should fail registering - invalid username length.', (done) => {
    chai.request(server)
    .post('/api/auth/register')
    .send({ username: '', password: '123456', email: 'issa@email.com' })
    .end((_, response) => {
      const { body } = response;
      response.should.have.status(400);
      Object.keys(body).should.have.lengthOf(1);
      response.should.have.property('error');
      done();
    });
  });

  it('Should fail registering - invalid password length.', (done) => {
    chai.request(server)
    .post('/api/auth/register')
    .send({ username: 'issa', password: '1', email: 'issa@email.com' })
    .end((_, response) => {
      const { body } = response;
      response.should.have.status(400);
      Object.keys(body).should.have.lengthOf(1);
      response.should.have.property('error');
      done();
    });
  });

  it('Should register successfully', (done) => {
  chai.request(server)
    .post('/api/auth/register')
    .send({ username: 'issa', password: '123456', email: 'issa@email.com' })
    .end((_, response) => {
      response.should.have.status(201);
      done();
    });
  });
});
  