const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken);


// run bulk export for calls from Sep 2022 - Nov 2022 in parent account
client.bulkexports.v1.exports('Calls')
      .exportCustomJobs
      .create({
         email: 'andre.chen@ui.com',
         startDay: '2022-08-31',
         endDay: '2022-11-01',
         friendlyName: 'parent_account_export'
       })
      .then(export_custom_job => {
      	console.log("Parent Account Bulk Export: " + export_custom_job.jobSid);
      	
      	// fetch all accounts / subaccounts
	    client.api.accounts.list()
	      .then(accounts => accounts.forEach(a => {
	        // check if this account is parent account (if ownerAccountSid == sid, this is parent and should skip)
	        if (a.ownerAccountSid != a.sid) {

	          // init client for subaccount
	          subClient = require('twilio')(a.sid, a.authToken);

			  // run bulk export for calls from Sep 2022 - Nov 2022 in subaccounts
	          subClient.bulkexports.v1.exports('Calls')
			      .exportCustomJobs
			      .create({
			         email: 'andre.chen@ui.com',
			         startDay: '2022-08-31',
			         endDay: '2022-11-01',
			         friendlyName: 'subaccount_export_' + a.sid
			       })
			      .then(export_custom_job => {
			      	console.log("Subaccount " + a.sid + " Bulk Export: " + export_custom_job.jobSid);
			      });
      }}));
	  });