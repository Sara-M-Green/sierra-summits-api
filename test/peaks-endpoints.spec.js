const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const PeaksService = require('../src/peaks/peaks-service')
const { makePeaksArray } = require('./peaks.fixtures')

describe('Peaks Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    
    before('clean the table', () => db.raw('TRUNCATE peaks_table RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup',() => db.raw('TRUNCATE peaks_table RESTART IDENTITY CASCADE'))

    describe(`GET /api/peaks`, () => {
        context('Given there are peaks in database', () => {
            const testPeaks = makePeaksArray()

            beforeEach('insert peaks', () => {
                return db
                    .into('peaks_table')
                    .insert(testPeaks)
            })

            it('responds with 200 and all of the peaks', () => {
                return supertest(app)
                    .get('/api/peaks')
                    .expect(200, testPeaks)
            })
        })
    })

    describe('GET /peaks/:id', () => {
        const testPeaks = makePeaksArray()

        it(`getById() resolves a peak by id from peaks_table`, () => {
            context('Given there are peaks in the db', () => {
                const thirdId = 3
                const thirdTestPeak = testPeaks[thirdId-1]
                return PeaksService.getById(db, thirdId)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: thirdId,
                            peakname: thirdTestPeak.peakname,
                            summit: thirdTestPeak.summit,
                            start: thirdTestPeak.start,
                            mileage: thirdTestPeak.mileage,
                            quadmap: thirdTestPeak.quadmap,
                            class: thirdTestPeak.class,
                            gain: thirdTestPeak.gain,
                            loss: thirdTestPeak.loss,
                            section: thirdTestPeak.section,
                            trailhead: thirdTestPeak.trailhead,
                            latlong: thirdTestPeak.latlong,
                            overview: thirdTestPeak.overview,
                            route: thirdTestPeak.route,
                            website: thirdTestPeak.website,
                            image: thirdTestPeak.image
                        })
                    })
            })
        })
    })

})