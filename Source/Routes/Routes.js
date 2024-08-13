const Express = require('express');
const Router = Express.Router();

Router.use('/activity', require('../Controller/ActivitControllers'));
Router.use('/accessconfig', require('../Controller/AccessConfigController'));
Router.use('/attendance', require('../Controller/AttendanceController'));
Router.use('/checklist', require('../Controller/ChecklistController'));
Router.use('/clientmanagement', require('../Controller/ClientManagementController'));
Router.use('/fileupload', require('../Controller/UploadController'));
Router.use('/jobmanagement', require('../Controller/JobManagementController'));
Router.use('/sidebar', require('../Controller/SidebarController'));
Router.use('/sitemanagement', require('../Controller/SiteManagementController'));
Router.use('/subadminaccess', require('../Controller/SubAdminAccessController'));
Router.use('/subactivity', require('../Controller/SubActivityController'));
Router.use('/submitchecklist', require('../Controller/SubmittedChecklistController'));
Router.use('/tempchecklist', require('../Controller/TempCheckListController'));
Router.use('/users', require('../Controller/UserController'));
Router.use('/usertype', require('../Controller/UserTypeController'));

module.exports = Router;
