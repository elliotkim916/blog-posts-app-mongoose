const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPost} = require('./models');

let server;

function runServer(databaseUrl, port=PORT) {
    // we have runServer return a promise because it will make things easier when its time to test the app
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
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