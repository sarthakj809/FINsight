const mongoose = require('mongoose');
require('dotenv').config();

const DBconnect = () => {
    mongoose.connect(process.env.MONGO_DB_URL).then(() => {
        console.log("Successfully connected to Database.")
    }).catch((error) => {
        console.log("Error while connecting to DB");
        console.error(error.message);
        process.exit(1);
    })
}

module.exports = DBconnect;