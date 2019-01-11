var mongoose = require('mongoose');

//Object holding all your connection strings
var connections = {};
var config = require('./auth-config')

exports.getDatabaseConnection = function (dbName) {
    console.log(dbName);
    if (!connections[dbName]) {
        connections[dbName] = mongoose.createConnection(config.SERVER + dbName, 
            { useMongoClient: true });
    }
    return connections[dbName];
}