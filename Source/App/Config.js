const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const environment = process.env;

module.exports = {
    DB_URL: {
        PRODUCT_URL: environment.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/JohnsonProduct'
    }
};
