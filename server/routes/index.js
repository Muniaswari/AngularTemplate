var user = require('./users.routes');
var customer = require('./customer.routes');
var role = require('./role.routes');
var master = require('./master.routes');
var menu = require('./menu.routes');
var formdesign = require('./formdesign.routes');
var user = require('./users.routes');
var userAdmin = require('./userAdmin.routes');
var permissions = require('./permissions.routes');
var communication = require('./communication.routes');

exports = module.exports = function (app) {
    app.use('/auth', user);
    app.use('/api/customer', customer);
    app.use('/api/user', userAdmin);
    app.use('/api/role', role);
    app.use('/api/master', master);
    app.use('/api/menu', menu);
    app.use('/api/formdesign', formdesign);
    app.use('/api/permissionapi', permissions);
    app.use('/api/communication', communication);
};
