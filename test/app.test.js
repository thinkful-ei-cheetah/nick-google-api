'use strict';

const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const playstore = require('../playstore');

describe('GET / endpoint', () => {
  it('should return the full playstore', () => {
    const expected = playstore;

    return request(app)
      .get('/') // invoke the endpoint
      .expect(200, expected)  //assert that you get a 200  OK status
      .expect('Content-Type', /json/);
  });
});

describe('GET /apps endpoint', () => {
  it('should return the full playstore', () => {
    const expected = playstore;

    return request(app)
      .get('/apps') // invoke the endpoint
      .expect(200, expected)  //assert that you get a 200  OK status
      .expect('Content-Type', /json/);
  });

  it('should return 400 for incorrect sort filter', () => {
    return request(app)
      .get('/apps')
      .query({sort: "gibberish"})
      .expect(400);
  });

  it('should return 200 with correctly sorted output by app name', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'app' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App < res.body[i + 1].App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should return 200 with correctly sorted output by app rating', () => {
    return request(app)
      .get('/apps')
      .query({ sort: 'rating' }) // localhost8080/apps?sort=rating
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  const possibleGenres = [
    'action',
    'puzzle',
    'strategy',
    'casual',
    'arcade',
    'card'
  ];

  possibleGenres.forEach(genre => {
    it('should return 200 with correctly filtered output by genre', () => {
      return request(app)
        .get('/apps')
        .query({ genres: genre }) // localhost8080/apps?sort=rating
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          res.body.forEach( app => {
            expect(app.Genres.toLowerCase()).to.include(genre);
          });
        });
    });
  });
});

describe('GET 404 ERROR', () => {
  it('should return 404 for incorrect path requests', () => {
    return request(app)
      .get('/gibberish')
      .expect(404);
  });
});