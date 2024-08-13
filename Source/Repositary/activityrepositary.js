const ActivityModel = require('../Models/ActivityModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const ActivityQuery = {
    /***
     * create activity
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createActivity: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let activity = await ActivityModel.create([document], options);
        return activity[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneActivity: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let ActivityData = await ActivityModel.findOne(condition, projection);
        console.log(ActivityData);
        return ActivityData;
        // return await ActivityModel.findOne(condition, projection);
    },
    /**
     * find activity
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findActicity: async (condition, projection, islean = true) => {
        let activity = await ActivityModel.find(condition, projection).lean(islean);
        return activity;
    },
    /**
     * update activity
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateActivity: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await ActivityModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteActivity: async (condition) => {
        let options = condition || {};
        return await ActivityModel.deleteOne(condition, options);
    }
};

module.exports = ActivityQuery;
