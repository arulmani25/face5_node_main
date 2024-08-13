const { check } = require('express-validator');

const Validate = {
    /**
     * List Validation
     * @returns
     */
    listValidation: () => {
        return [check('title', 'please enter the title').notEmpty({ ignore_whitespace: true })];
    },
    /**
     * Create Activity
     * @returns
     */
    createActivityValidation: () => {
        return [
            check('title', 'please enter the title').notEmpty().trim(),
            check('description', 'please enter description').notEmpty().trim(),
            check('index', 'please enter index').notEmpty().trim()
        ];
    },
    /**
     * Update Status
     * @returns
     */
    UpdateStatus: () => {
        return [
            check('activity_id', 'please enter activity_id').notEmpty().trim(),
            check('title', 'please enter the title').notEmpty().trim(),
            check('description', 'please enter description').notEmpty().trim(),
            check('index', 'please enter index').notEmpty().trim()
        ];
    },
    detailValidation: () => {
        return [check('activity_id', 'please enter the activity_id').notEmpty({ ignore_whitespace: true })];
    }
};
module.exports = Validate;
