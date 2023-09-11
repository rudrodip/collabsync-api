const twilio = require('twilio');
const { twilio_ssid, twilio_auth_token } = require('../config')

// Create a Twilio client
const client = twilio(twilio_ssid, twilio_auth_token);

// Function to send a WhatsApp message
function sendWhatsAppMessage(to, message) {
  client.messages
    .create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    })
    .then((message) => console.log(`WhatsApp message sent with SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending WhatsApp message: ${error.message}`));
}

module.exports = { sendWhatsAppMessage }
