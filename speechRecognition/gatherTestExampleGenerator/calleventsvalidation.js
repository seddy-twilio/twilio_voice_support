const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Get list of incoming calls from today
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
	      	if(e.request.parameters.speech_result) {
	      		let sr = e.request.parameters.speech_result;
	      		sr = sr.replace(/\s+/g, '');
            // Update string below with string you would like to validate against, in this case, the string that is incorrect (i.e. a bug)
	      		if (sr == "1510036470001") {
	      			console.log(e.request.parameters.call_sid);
	      		}
	      	}
     	  }));
}));
