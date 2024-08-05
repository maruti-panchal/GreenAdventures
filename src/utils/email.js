// const nodemailer = require('nodemailer');
// require('dotenv').config();
// const sendEmail = async (options) => {
//   // create transporter

//   const transporter = nodemailer.createTransport({
//     host: process.env.Email_HOST,
//     port: process.env.Email_PORT,
//     auth: {
//       user: process.env.Email_USERNAME,
//       pass: process.env.Email_PASSWORD,
//     },
//   });
//   console.log('transport created');
//   // DEFINE EMAIL OPTIONS
//   const mailOptions = {
//     from: 'green adventures <greenadventures@do.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   console.log('mail optins created');

//   // SEND THE MAIL
//   await transporter.sendMail(mailOptions);

//   console.log('sent mail');
// };

// exports.sendEmail = sendEmail;

const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  try {

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Corrected variable name
      port: process.env.EMAIL_PORT || 2525, // Corrected variable name
      auth: {
        user: process.env.EMAIL_USERNAME, // Corrected variable name
        pass: process.env.EMAIL_PASSWORD, // Corrected variable name
      },
 
    });



    // Define email options

    // Send the mail
    await transporter.sendMail({
      from: 'Green Adventures <greenadventures@do.io>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

  
  } catch (error) {
    // console.error('Error sending email:', error);
    throw new Error(
      'There was an error sending the email. Please try again later.'
    );
  }
};

exports.sendEmail = sendEmail;
