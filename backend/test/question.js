process.env.NODE_ENV = "test";

const chai = require('chai');
const request = require('supertest')
const chaiHttp = require('chai-http');
const async = require('async')
const server = require('../index')['app'];
const Question = require('../models/question');
const Room = require('../models/room');
const User = require('../models/user');
const { expect } = require('chai');

const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 500;
const STATUS_CODE_PARTIAL_CONTENT = 206;
const STATUS_CODE_NOT_FOUND = 404;

chai.should()
chai.use(chaiHttp)

describe("Question API", () => {
    // Test POST Request
    beforeEach((done) => {
        Question.deleteMany({}, err => {
            Room.deleteMany({}, err => {
                User.deleteMany({}, err => {
                    done();
                }) 
            })    
        })
        
    })
    describe("POST /api/question", () => {
        it("It should POST a question", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            chai.request(server)
                .post('/api/question/create')
                .send(question)
                .end((err, res) => {
                    res.should.have.status(STATUS_CODE_OK);
                    res.should.be.a('object');
                    res.body.should.have.property('questionId');
                    res.body.should.have.property('message');
                done();
                });
        });

        it("It should NOT POST a question without any of the three fields", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
            });
            chai.request(server)
                .post('/api/question/create')
                .send(question)
                .end((err, res) => {
                    res.should.have.status(STATUS_CODE_PARTIAL_CONTENT);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                done();
                });
        })
    })

    
    /*
     *  Test GET Request
     */ /*
    describe("GET /api/question", () => {
        it("It should GET a question by the given id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                chai.request(server)
                    .get('/api/question/' + question.id)
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_OK);
                        res.body.should.have.property("message");
                        res.body.question.should.have.property('_id').eql(question.id);
                        res.body.question.should.have.property('questionStatement').eql(question.questionStatement);
                        res.body.question.should.have.property('sampleSolution').eql(question.sampleSolution);
                        res.body.question.should.have.property('difficulty').eql(question.difficulty);
                    done();
                    });

            })
        });

        it("It should GET a question by the given id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                chai.request(server)
                    .get('/api/question/' + "123")
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_NOT_FOUND);
                        res.body.should.have.property("message");
                        res.body.should.have.property("message").eql("Question not found");
                    done();
                    });

            })
        })
    })
    */
    describe("GET /api/question", () => {
        it("It should GET a question by the given id when there is a room", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                var roomId = null;
                async.series([
                    cb => { request(server).post('/api/register').send({username: "alan", password: "cs3219", email: "alan@yahoo.com"}).expect(201, cb)},
                    cb => { request(server).post('/api/register').send({username: "oongjiexiang", password: "cs3219", email: "oong@yahoo.com"}).expect(201, cb)},
                    cb => { request(server).post('/api/login').send({username: "oongjiexiang", password: "cs3219"}).expect(201, cb)},
                    cb => { request(server).post('/api/login').send({username: "alan", password: "cs3219"}).expect(201, cb)},
                    cb => { request(server).post('/api/match/new').send({username: "oongjiexiang", difficulty: "Easy"}).expect(200, cb)},
                    cb => { request(server).post('/api/match/new').send({username: "alan", difficulty: "Easy"}).expect(200, cb)},
                    cb => { 
                        request(server).post('/api/match/status').send({username: "alan", difficulty: "Easy"}).expect(200)
                            .then(response => {
                                roomId = response.body.roomId;
                                console.log(roomId); 
                                cb();
                            })
                    },
                    cb => { 
                        request(server).get('/api/question/' + roomId).expect(200)
                            .end((err, res) => {
                                expect(res.body).to.have.property("message");
                                expect(res.body.message).to.be.equal("Question found");
                                expect(res.body.question).to.be.an("object");
                                return cb()
                            })
                    }
                ], done)
            })
        });
    })

    /*
     *  Test UPDATE Request
     */ 
    describe("UPDATE /api/question", () => {
        it("It should UPDATE a question by the given id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                let question2_json = {
                    content: {
                        questionStatement: "Statement2",
                        sampleSolution: "Solution2",
                        difficulty: "Medium"
                    }
                };
                chai.request(server)
                    .put('/api/question/' + question.id)
                    .send(question2_json)
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_OK);
                        res.body.should.have.property("message");
                        res.body.message.should.eql("Question updated");
                        res.body.question.questionStatement.should.eql(question2_json.content.questionStatement);
                        res.body.question.sampleSolution.should.eql(question2_json.content.sampleSolution);
                        res.body.question.difficulty.should.eql(question2_json.content.difficulty);
                    done();
                    });

            })
        });

        it("It should NOT UPDATE a question with a non-existing id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                let question2_json = {
                    content: {
                        questionStatement: "Statement2",
                        sampleSolution: "Solution2",
                        difficulty: "Medium"
                    }
                };
                chai.request(server)
                    .put('/api/question/' + "123")
                    .send(question2_json)
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_NOT_FOUND);
                        res.body.should.have.property("message");
                        res.body.message.should.eql("Question not found");
                    done();
                    });

            })
        })
    })

    /*
     *  Test DELETE Request
     */ 
    describe("DELETE /api/question", () => {
        it("It should DELETE a question by the given id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                chai.request(server)
                    .delete('/api/question/' + question.id)
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_OK);
                        res.body.should.have.property("message");
                        res.body.should.have.property('message').eql("Question deleted");
                    done();
                    });

            })
        });

        it("It should NOT DELETE a question by a non-existing id", (done) => {
            let question = new Question({
                questionStatement: "A statement",
                sampleSolution: "a solution",
                difficulty: "Easy"
            });
            question.save((err, question) => {
                chai.request(server)
                    .delete('/api/question/' + "123")
                    .end((err, res) => {
                        res.should.have.status(STATUS_CODE_NOT_FOUND);
                        res.body.should.have.property("message");
                        res.body.should.have.property('message').eql("Question not found");
                        res.body.should.have.property('error');
                    done();
                    });

            })
        })
    })
})