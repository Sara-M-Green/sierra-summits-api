require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const peaksRouter = require('./peaks/peaks-router')
const commentsRouter = require('./comments/comments-router')
// const data = require('../data')

const app = express()

const morganOption = (NODE_ENV === 'production') 
    ? 'tiny' 
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/peaks', peaksRouter)
app.use('/api/comments', commentsRouter)


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
