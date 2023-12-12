// Create web server
// Load the express module
var express = require('express');
// Load the body-parser module
var bodyParser = require('body-parser');
// Load the mongoose module
var mongoose = require('mongoose');
// Load the Comments schema
var Comments = require('../models/comments');
// Load the authenticate module
var authenticate = require('../authenticate');
// Create express router
var commentRouter = express.Router();
// Use body-parser
commentRouter.use(bodyParser.json());

// Route for '/'
commentRouter.route('/')
// Get all comments
.get(authenticate.verifyUser, (req, res, next) => {
    Comments.find({})
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// Post a comment
.post(authenticate.verifyUser, (req, res, next) => {
    Comments.create(req.body)
    .then((comment) => {
        Comments.findById(comment._id)
        .populate('author')
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
// Update all comments
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
// Delete all comments
.delete(authenticate.verifyUser, (req, res, next) => {
    Comments.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);        
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Route for '/:commentId'
commentRouter.route('/:commentId')
// Get a comment
.get(authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);        
    }, (err) => next(err))
    .catch((err) => next(err));
})
//