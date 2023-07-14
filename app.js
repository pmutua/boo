'use strict';

const app = require('./config/server');
const profileRoute = require('./routes/profiles');
const commentRoutes = require('./routes/comments');

// Mount the profile route
app.use('/', profileRoute);
app.use('/api/comments', commentRoutes);

module.exports = app;
