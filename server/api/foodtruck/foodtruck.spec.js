'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('POST /api/foodtrucks/search', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .post('/api/foodtrucks/search')
      .send({longitude: -122.42, latitude: 37.78, radius: 1609}) 
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('POST /api/foodtrucks/search', function() {

  it('should respond with 400 Bad request if no parameters', function(done) {
    request(app)
      .post('/api/foodtrucks/search')
      .send() 
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});