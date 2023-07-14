'use strict';

const app = require('./config/server');
const profileRoute = require('./routes/profile');
// const commentRoutes = require('./routes/comment');

// Mount the profile route
app.use('/', profileRoute);
// app.use('/api/comments', commentRoutes);

module.exports = app;
