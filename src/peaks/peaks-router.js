const express = require('express')
const PeaksService = require('./peaks-service')

const peaksRouter = express.Router()

peaksRouter
    .route('/')
    .get((req, res, next) => {  
        const { sort, search="" } = req.query
        console.log(`-----------------------------------${search}`)
        const knexInstance = req.app.get('db')
        let peakResults
        PeaksService.getAllPeaks(knexInstance)
            .then(peaks => {
            peakResults = peaks
            if (sort) {
                if(!['peakname', 'gain', 'mileage' ].includes(sort)) {
                    return res
                        .status(400)
                        .send('Must sort by Peak Name, Elevation Gain or Mileage')
                }
            }

            if (search) {
                console.log(peaks)
                peakResults = peaks
                .filter(peak => 
                    peak.peakname
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )  
            }
            

            if (sort) {
                peakResults = peaks
                .sort((a, b) => {
                    return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
                })
            }

                res.json(peakResults)
            })
            
            .catch(next)
    })

peaksRouter
    .route('/:id')
    .all((req, res, next) => {
        PeaksService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(peak => {
                if (!peak) {
                    return res.status(404).json({
                        error: { message: `Peak with that ID does not exist.`}
                    })
                }
                res.peak = peak 
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.peak.id,
            peakname: res.peak.peakname,
            summit: res.peak.summit,
            start: res.peak.start,
            mileage: res.peak.mileage,
            quadmap: res.peak.quadmap,
            class: res.peak.class,
            gain: res.peak.gain,
            loss: res.peak.loss,
            section: res.peak.section,
            trailhead: res.peak.trailhead,
            latlong: res.peak.latlong,
            overview: res.peak.overview,
            route: res.peak.route,
            website: res.peak.website,
            image: res.peak.image
        })
    })

module.exports = peaksRouter