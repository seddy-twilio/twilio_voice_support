const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

// Update tNum with a Twilio number in your account
const tNum = '+13013218239';

// Set the number of calls you would like to create
const loops = 50;

// Loop until all calls created
for (let i=0; i<loops; i++) {

	// Create call
  client.calls
  .create({
    url: 'https://handler.twilio.com/twiml/EH9c1d6a2b740721c3247ca684a276962e', // Make sure url is updated with instructions to serve the audio you would like to test
    to: '+13312561485', // Make sure this twilio number is configured with <Gather>
    from: tNum,
    record: true
  })
  .then(call => console.log(call.sid))
  .catch(e => {console.log('Got an error:', e.code, e.message)})
}
