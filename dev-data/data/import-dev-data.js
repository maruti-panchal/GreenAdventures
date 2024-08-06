// Script to import all data from satic file to database in one go.
require('dotenv').config();
const { default: mongoose } = require('mongoose');
const Tour = require('../../src/models/toursModel');

const fs = require('fs');

mongoose
  .connect(
    'mongodb+srv://panchalmaruti70:Z8aQmZlbbJyZuB8Y@cluster0.v56gz9j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then((con) => console.log('Database Connected Successfully....'))
  .catch((err) => console.log('Error Occured 🐛 : ', err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
console.log(tours);
const importData = async () => {
  try {
    await Tour.insertMany(tours);
    console.log('Data Successfully Loaded....😉');
  } catch (error) {
    console.log('Error Occured 😥 :- ', error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted Success...🙂');
  } catch (error) {
    console.log('Error Occured 😥 :- ', error);
  }
};

importData();
