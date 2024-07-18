const { default: mongoose } = require('mongoose');
require('dotenv').config();
const database = () => {
  return mongoose
    .connect(process.env.DB_CONN)
    .then((con) => console.log('Database Connected Successfully....'))
    .catch((err) => console.log('Error Occured 🐛 : ', err));
};

module.exports = database;
