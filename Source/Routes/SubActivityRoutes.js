const Express = require('express');
const Router = Express.Router();

Router.use('/subactivity', require('../Controller/SubActivityController'));
