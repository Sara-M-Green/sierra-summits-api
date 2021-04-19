const path = require('path')
const express = require('express')
const xss = require('xss')
const CommentsService = require('./comments-service')
const PeaksService = require('../peaks/peaks-service')

const commentsRouter = express.Router()
const jsonParser = express.json()

const serializeComment = comment => ({
    id: comment.id,
    comment: xss(comment.comment),
    date_commented: comment.date_commented,
    peak_id: comment.peak_id,
    username: comment.username
})

commentsRouter 
    .route('/:peak_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CommentsService.getByPeakId(
            knexInstance,
            req.params.peak_id
        )
            .then(comments => {
                res.json(comments.map(serializeComment))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { comment, date_commented, peak_id, username } = req.body
        const newComment = { comment, peak_id, username }

        for (const [key, value] of Object.entries(newComment))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` }
                })
        
        newComment.date_commented = date_commented

        CommentsService.insertNewComment(
            req.app.get('db'),  
            newComment
        )
            .then(comment => {
                res.status(201)
                .location(`/api/comments/${newComment.peak_id}`)
                .json(serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter
    .route('/:comment_id')
    .all((req, res, next) => {
        CommentsService.getByCommentId(
            req.app.get('db'),
            req.params.comment_id
        )
        .then(comment => {
            if (!comment) {
                return res.status(400).json({
                    error: { message: `Comment with that ID does not exist`}
                })
            }
            res.comment = comment
            next()
        })
    })
    // .get((req, res, next) => {
    //     res.json(serializeComment(res.comment))
    // })
    // .delete((req, res, next) => {
    //     CommentsService.deleteComment(
    //         req.app.get('db'),
    //         req.params.comment_id
    //     )
    // })

module.exports = commentsRouter