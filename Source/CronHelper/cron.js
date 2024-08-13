const jobManagement = require('../Models/JobManagementModel');
const cron = require('node-cron');
const moment = require('moment');

const runCron = async () => {
    cron.schedule('0 0 * * *', async () => {
        const jobs = await jobManagement.find({ is_master: true });
        let i = 0;
        for (const iterator of jobs) {
            const jobIdDate = moment().format('YYYYMMDDHHmmss');
            const jobId = `JB${jobIdDate}${i}`;
            const jobPayload = {
                activityId: iterator.activityId.toString(),
                siteId: iterator.siteId.toString(),
                jobTitle: iterator.jobTitle,
                jobDate: new Date(),
                contactName: iterator.contactName,
                contactNumber: iterator.contactNumber,
                techName: iterator.techName,
                jobAddress: {
                    address: iterator.jobAddress.address,
                    lng: iterator.jobAddress.lng,
                    lat: iterator.jobAddress.lat
                },
                jobId: jobId,
                techNumber: iterator.techNumber
            };
            i++;
            console.log(jobPayload);
            const createJob = await jobManagement.create(jobPayload);
        }
        console.log('running a task every minute');
    });
};

module.exports = { runCron };
