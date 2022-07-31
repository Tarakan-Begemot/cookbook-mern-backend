const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.ATLAS_URI)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
