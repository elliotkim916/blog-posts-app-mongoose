'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPost} = require('./models');

const app = express();
app.use(bodyParser.json());
// makes the req.body into json

// GET requests to /blog-posts => returns all blog posts
app.get('/posts', (req, res) => {
    BlogPost
        .find()
        .then(blogposts => {
            res.json({ 
                allBlogPosts: blogposts.map(
                    (post) => post.serialize()) 
            });
        })
        .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
    });
});

// GET request by ID => returns one blog post
app.get('/posts/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(post => res.json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
    });
});

// POST request => able to create new blog post
app.post('/posts', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
   BlogPost
        .create(req.body)
        .then((post) => res.status(201).json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
    }); 
});

// PUT request => able to update blog post by ID
app.put('/posts/:id', (req, res) => {
    if (!(req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({message: message});
    }

    const toUpdate = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach((field) => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
    }
});

    BlogPost
    // {new: true} allows update to happen after first send
        .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
        .then((post) => res.status(200).json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
    });
});

// DELETE request => able to delete blog post by ID
app.delete('/posts/:id', (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
    });
});

let server;

function runServer(databaseUrl, port=PORT) {
    // we have runServer return a promise because it will make things easier when its time to test the app
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }

            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
};