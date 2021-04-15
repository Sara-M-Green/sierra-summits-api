require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const PeaksService = require('./peaks/peaks-service')


const app = express()

const morganOption = (NODE_ENV === 'production') 
    ? 'tiny' 
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())



app.get('/api/peaks', (req, res, next) => {
    PeaksService.getAllPeaks(req.app.get('db'))
        .then(peaks => {
            res.json(peaks)
        })
        .catch(next)
    
})


// app.get('/api/peaks', (req, res) => {
//     const { search = "", sort } = req.query

//     if (sort) {
//         if(!['peakName', 'gain', 'mileage' ].includes(sort)) {
//             return res
//                 .status(400)
//                 .send('Must sort by Peak Name, Elevation Gain or Mileage')
//         }
//     }

//     let results = data
//         .filter(peak => 
//             peak.peakName
//             .toLowerCase()
//             .includes(search.toLowerCase()))

//     if (sort) {
//         results
//             .sort((a, b) => {
//                 return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
//             })
//     }

//     res.json(results)
// })

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app
