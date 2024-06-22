import Brute from 'express-brute';
import MongooseStore from 'express-brute-mongo';
import mongoose from 'mongoose';
import config from '../../../config';

const store = new MongooseStore(function (ready) {
  mongoose.connect(config.db.uri, {
    dbName: config.db.name,
  });
  ready(mongoose.connection.collection('bruteforce-store'));
});

const bruteForce = new Brute(store, {
  freeRetries: config.bruteForce.freeRetries, // Number of allowed retries before applying restrictions
  minWait: config.bruteForce.minWait, // Minimum wait time (in milliseconds)
  maxWait: config.bruteForce.maxWait, // Maximum wait time (in milliseconds)
  lifetime: config.bruteForce.lifetime, // Lifetime (in seconds)
  failCallback: function (req, res, next, nextValidRequestDate) {
    res.status(429).json({
      message: `Too many attempts, please try again after ${Math.ceil(
        (nextValidRequestDate.getTime() - Date.now()) / 60000,
      )} minutes.`,
    });
  },
});

export default bruteForce;
