const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

describe('/api/movies tests', () => {

    let token, movieID;

    before((done) => {
        chai.request(server).post('/authenticate').send({ username: 'yozturk2', password: 'deneme' }).end((err, res) => {
            token = res.body.token;
            console.log(token);
            done();
        });
    });

    describe('/GET movies', () => {
        it('it should GET all the movies', (done) => {
            chai.request(server).get('/api/movies').set('x-access-token', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('/POST movie', () => {
        it('it should POST a movie', (done) => {
            const movie = {
                title: 'Udemy',
                director_id: '5f97fcfdddf17c46c87823ab',
                category: 'Komedi',
                country: 'Türkiye',
                year: 1950,
                imdb_score: 8
            }
            chai.request(server).post('/api/movies/addMovie').set('x-access-token', token).send(movie).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('director_id');
                res.body.should.have.property('category');
                res.body.should.have.property('country');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                movieID = res.body._id;
                done();
            });

        });
    });

    describe('/GET/:movie_id', () => {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server).get('/api/movies/getMovie/' + movieID).set('x-access-token', token).end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('director_id');
                res.body.should.have.property('category');
                res.body.should.have.property('country');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                res.body.should.have.property('_id').eql(movieID);
                done();
            });
        });
    });

    describe('/PUT a movie', () => {
        it('it should UPDATE a movie by the given id', (done) => {
            const movie = {
                title: '93 creative',
                director_id: '5f97fcfdddf17c46c87823ab',
                category: 'Suç',
                country: 'Fransa',
                year: 1970,
                imdb_score: 9
            }
            chai.request(server).put('/api/movies/updateMovie/' + movieID).set('x-access-token', token).send(movie).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title').eql(movie.title);
                res.body.should.have.property('director_id').eql(movie.director_id);
                res.body.should.have.property('category').eql(movie.category);
                res.body.should.have.property('country').eql(movie.country);
                res.body.should.have.property('year').eql(movie.year);
                res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                done();
            });

        });
    });

    describe('/DELETE a movie', () => {
        it('it should DELETE a movie by the given id', (done) => {

            chai.request(server).delete('/api/movies/deleteMovie/' + movieID).set('x-access-token', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                done();
            });

        });
    });



});