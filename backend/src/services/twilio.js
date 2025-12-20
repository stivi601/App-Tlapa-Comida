const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log(`SMS enviado a ${to}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Error enviando SMS a ${to}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
