const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Get list of all calls since date shown
client.calls
      .list({
         startTimeAfter: "2021-01-14",
         direction: 'inbound'
       })
      .then(calls => calls.forEach(c => {

      // Confirm Example with Call Events
		  client.calls(c.sid)
	      .events
	      .list()
	      .then(events => events.forEach(e => {
          
          // Check if speech result included in request
	      	if(e.request.parameters.speech_result) {
          
            // If included, print call SID and speech result value to console
	      		console.log("Call: " + e.request.parameters.call_sid);
	      		console.log("Speech Result: " + e.request.parameters.speech_result);
	      	}
          
          // Check if digits included in request
	      	else if(e.request.parameters.digits) {
          
            // If included, print call SID and digits value to console
	      		console.log("Call: " + e.request.parameters.call_sid);
	      		console.log("Digits: " + e.request.parameters.digits);
	      	}
     	  }));
}));
