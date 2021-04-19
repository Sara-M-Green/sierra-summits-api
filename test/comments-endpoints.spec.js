const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makePeaksArray } = require('./peaks.fixtures')
const { makeCommentsArray, makeMaliciousComment } = require('./comments.fixtures')

describe.only('Comments Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    
    before('clean the table', () => db.raw('TRUNCATE peaks_table, comments RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup',() => db.raw('TRUNCATE peaks_table, comments RESTART IDENTITY CASCADE'))
    
    describe(`GET /api/comments/:peak_id`, () => {
        context('Given there are no comments in database', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/comments/500')
                    .expect(200, [])
            })
        })

        context('Given there are comments in database', () => {
            const testPeaks = makePeaksArray()
            const testComments = makeCommentsArray()

            beforeEach('insert peaks', () => {
                return db
                    .into('peaks_table')
                    .insert(testPeaks)
                    .then(() => {
                        return db
                            .into('comments')
                            .insert(testComments)
                    })
            })

            it('responds with 200 and all of the comments', () => {
                return supertest(app)
                    .get('/api/comments/1')
                    .expect(200, testComments)
            })
        })
    })

    describe(`POST /api/comments/:peak_id`, () => {
        const testPeaks = makePeaksArray()
        beforeEach('insert peaks', () => {
            return db
                .into('peaks_table')
                .insert(testPeaks)
        })

        it ('Creates a comment and responds with 201', () => {
            this.retries(3)
            const newComment = {
                username: "Test Username",
                peak_id: 1,
                comment: "Test comment testing testing"
            }
            return supertest(app)
                .post('/api/comments/:id')
                .send(newComment)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(newComment.username)
                    expect(res.body.peak_id).to.eql(newComment.peak_id)
                    expect(res.body.comment).to.eql(newComment.comment)
                    expect(res.body).to.have.property('peak_id')
                    expect(res.headers.location).to.eql(`/api/comments/${res.body.peak_id}`)
                    const expected = new Date().toLocaleString()
                    const actual = new Date(res.body.date_commented).toLocaleString()
                    expect(actual).to.eql(expected)
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/comments/${res.body.peak_id}`)
                        .expect([res.body])       
                )
                
        })

        const requiredFields = ['username', 'comment']

        requiredFields.forEach(field => {
            const newComment = {
                username: 'TEST USER',
                comment: 'testtesttesttesttesttest',
                peak_id: 3
            }

            it(`Responds with 400 and an error message when the ${field} is missing`, () => {
                delete newComment[field]

                return supertest(app)
                    .post('/api/comments/:peak_id')
                    .send(newComment)
                    .expect(400, {
                        error: { message: `Missing ${field} in request body` }
                    })
            })
        })

        context('Given and XSS attack comment', () => {
            const { maliciousComment, expectedComment} = makeMaliciousComment()

            it('Removes an XSS attack from content response', () => {
                return supertest(app)
                    .post(`/api/comments/${maliciousComment.peak_id}`)
                    .send(maliciousComment)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.username).to.eql(expectedComment.username)
                        expect(res.body.comment).to.eql(expectedComment.comment)
                    })
            })

        })
    })
})


