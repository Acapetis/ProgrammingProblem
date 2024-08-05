const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

describe('To-do list API', () => {
  let testTodo;

  it('should create a new to-do item', (done) => {
    request(app)
      .post('/todos')
      .send({ title: 'Test Todo', description: 'This is a test to-do item' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        testTodo = res.body;
        expect(testTodo).to.have.property('id');
        expect(testTodo.title).to.equal('Test Todo');
        expect(testTodo.description).to.equal('This is a test to-do item');
        expect(testTodo.completed).to.equal(false);
        expect(testTodo).to.have.property('dateAdded');
        done();
      });
  });

  it('should retrieve all to-do items with pagination', (done) => {
    request(app)
      .get('/todos?page=1&limit=1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });

  it('should retrieve a single to-do item by ID', (done) => {
    request(app)
      .get(`/todos/${testTodo.id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id', testTodo.id);
        expect(res.body.title).to.equal('Test Todo');
        expect(res.body.description).to.equal('This is a test to-do item');
        expect(res.body.completed).to.equal(false);
        done();
      });
  });

  it('should update an existing to-do item by ID', (done) => {
    request(app)
      .put(`/todos/${testTodo.id}`)
      .send({ title: 'Updated Test Todo', description: 'This is an updated test to-do item' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id', testTodo.id);
        expect(res.body.title).to.equal('Updated Test Todo');
        expect(res.body.description).to.equal('This is an updated test to-do item');
        done();
      });
  });

  it('should mark a to-do item as completed', (done) => {
    request(app)
      .patch(`/todos/${testTodo.id}/completed`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id', testTodo.id);
        expect(res.body.completed).to.equal(true);
        done();
      });
  });

  it('should mark a to-do item as incomplete', (done) => {
    request(app)
      .patch(`/todos/${testTodo.id}/incomplete`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id', testTodo.id);
        expect(res.body.completed).to.equal(false);
        done();
      });
  });

  it('should delete a to-do item by ID', (done) => {
    request(app)
      .delete(`/todos/${testTodo.id}`)
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return 404 for a non-existent to-do item', (done) => {
    request(app)
      .get('/todos/999')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message', 'Todo item not found');
        done();
      });
  });

  it('should filter to-do items by date with pagination', (done) => {
    const date = new Date().toISOString().split('T')[0];
    request(app)
      .get(`/todos/filter?date=${date}&page=1&limit=1`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('dateAdded');
        const todoDate = new Date(res.body[0].dateAdded).toISOString().split('T')[0];
        expect(todoDate).to.equal(date);
        done();
      });
  });

  it('should search to-do items by content with pagination', (done) => {
    request(app)
      .get('/todos/search?query=Test&page=1&limit=1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('title', 'Test Todo');
        done();
      });
  });
});
