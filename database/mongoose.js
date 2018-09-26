const mongoDB = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
process.env.MONGODB_URI =
  // 'mongodb://ddexta:balamutas1@ds229621.mlab.com:29621/ddextadb';
  'mongodb://ddexta:balamutas1@ds257241.mlab.com:57241/ddextatesting';
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);
module.exports = {
  mongoose
};
