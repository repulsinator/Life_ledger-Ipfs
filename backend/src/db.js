const { MongoClient } = require('mongodb')
require('dotenv').config();

let dbConnection


let url = process.env.MONGO_URL;

if (!url) {
    console.error('MONGO_URL is not defined. Please check your .env file or environment variable configuration.');
    process.exit(1); // Exit the application if the URL is not defined
}

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(url)
            .then((client) => {
                dbConnection = client.db("lifedb1")
                return cb();
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection








}