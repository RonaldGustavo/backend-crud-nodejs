const dbConfig = require('../config/database');
const mongoose = require('mongoose');

module.exports = {
  mongoose,
  url: dbConfig.url,
  todolist: require('./todolist.model.js')(mongoose),
};
