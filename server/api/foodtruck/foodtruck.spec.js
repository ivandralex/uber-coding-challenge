'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('POST /api/foodtrucks/search', function(){
	it('should respond with JSON array', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -122.42, latitude: 37.78, radius: 1609})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.be.instanceof(Array);
				done();
			});
	});

	it('should respond with code 400 if no parameters', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if longitude not Number', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: 'not number', latitude: 37.78, radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if latitude not Number', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -122.42, latitude: 'not number', radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if radius not Number', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -122.42, latitude: 37.78, radius: 'not number'})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if latitude < -90 degress', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -122.42, latitude: -95, radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if latitude > 90 degress', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -122.42, latitude: 95, radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if longitude < -180 degress', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: -185, latitude: 37.78, radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if longitude > 185 degress', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: 185, latitude: 37.78, radius: 1609})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with 400 if radius < 0', function(done){
		request(app)
			.post('/api/foodtrucks/search')
			.send({longitude: 185, latitude: 37.78, radius: -100})
			.expect(400)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with code 405 if method GET', function(done){
		request(app)
			.get('/api/foodtrucks/search')
			.expect(405)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with code 405 if method PUT', function(done){
		request(app)
			.put('/api/foodtrucks/search')
			.expect(405)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with code 405 if method PATCH', function(done){
		request(app)
			.patch('/api/foodtrucks/search')
			.expect(405)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});

	it('should respond with code 405 if method DELETE', function(done){
		request(app)
			.delete('/api/foodtrucks/search')
			.expect(405)
			.expect('Content-Type', /json/)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				res.body.should.have.property('description');
				done();
			});
	});
});
