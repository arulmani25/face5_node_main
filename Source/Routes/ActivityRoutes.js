const Express = require('express');
const Router = Express.Router();
const { createActivity, list, detail, update, deleteActivity } = require('../Controller/ActivityController');
const { isEmpty } = require('../Helpers/Utils');
const { VerifyToken, GenerateToken } = require('../Helpers/JWSToken');
const { sendFailureMessage, sendSuccessData } = require('../App/Responder');
const { validationResult } = require('express-validator');
const { createActivityValidation, UpdateStatus, detailValidation } = require('../Validators/ActivityValidation');

Router.post('/activity/create', createActivityValidation(), async (request, response) => {
    try {
        let hasErrors = validationResult(request);
        if (hasErrors.isEmpty()) {
            let { error, message, data } = await createActivity(request?.body);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
            return sendFailureMessage(response, message, 422);
        } else {
            return sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
        }
    } catch (error) {
        console.log(error);
        return sendFailureMessage(response, error, 500);
    }
});

Router.get('/activity/list/:activityId?', async (request, response) => {
    try {
        let hasErrors = validationResult(request);
        if (hasErrors.isEmpty()) {
            let { error, message, data } = await list(request?.query, request?.params?.activityId);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
        } else {
            return sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.get('/activity/detail/:activityId?', async (request, response) => {
    try {
        console.log(request?.params?.activityId);
        let { error, message, data } = await detail(request?.params?.activityId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.patch('/activity/updateActivities', UpdateStatus, VerifyToken, async (request, response) => {
    try {
        let hasError = validationResult(request);
        if (hasError.isEmpty()) {
            let { error, message, data } = await update(request?.body);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
        } else {
            return sendFailureMessage(response, hasError?.errors[0]?.msg, 422);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.delete('/activity/delete/:activityId', async (request, response) => {
    try {
        let { error, message, data } = await deleteActivity(request.params.activityId);
        if (error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

module.exports = Router;
