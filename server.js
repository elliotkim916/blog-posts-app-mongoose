'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPost} = require('./models');

const app = express();
app.use(bodyParser.json());

// GET requests to /blog-posts => returns all blog posts
app.get('/blog-posts', (req, res) => {
    BlogPost
        .find()
        .then(blogposts => {
            res.json({ 
                blogposts: blogposts.map(
                    (post) => post.serialize()) 
            });
        })
        .catch(
            err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
    });
});

// GET request by ID => returns one blog post
app.get('/blog-posts/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(post => res.json(post.serialize()))
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
            })
        })
    })
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
};