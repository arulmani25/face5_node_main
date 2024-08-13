const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const Conection = {
    expressIgniter: (Express) => {
        Express.listen(3000, () => {
            logger.info('server is started on http://localhost:3000');
        });
    }
};

module.exports = Conection;
