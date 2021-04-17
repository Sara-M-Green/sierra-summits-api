const path =  require('path')
const express = require('express')
const PeaksService = require('./peaks-service')

const peaksRouter = express.Router()

peaksRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        PeaksService.getAllPeaks(knexInstance)
            .then(peaks => {
                res.json(peaks)
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