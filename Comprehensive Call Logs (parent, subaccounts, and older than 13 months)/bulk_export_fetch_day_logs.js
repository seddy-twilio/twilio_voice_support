const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken);
const fs = require('fs');
const https = require('https');

// UPDATE THESE VARS !!
let startDate = '2022-08-31';
let endDate =  '2022-11-01';


async function download() {
   // Define date range - should match what was initiated
   var start = new Date(startDate);
   var end = new Date(endDate);

   console.log("Archived call logs download beginning for Days between " + start + " and " + end);

   // start loop through date range
   var date = new Date(start);
   while(date <= end){

      const dateFormatted = date.toISOString().split('T')[0];

       // fetch day object from bulk export
       await client.bulkexports.v1.exports('Calls')
        .days(dateFormatted)
        .fetch()
        .then(day => {
            const file = fs.createWriteStream(accountSid + "_" + dateFormatted + ".gz");
              https.get(day.redirectTo, function(response) {
               response.pipe(file);
             });
        });

        // Update date to next day then continue loop
       var newDate = date.setDate(date.getDate() + 1);
       date = new Date(newDate);
   }

  // fetch all accounts / subaccounts
    client.api.accounts.list()
      .then(accounts => accounts.forEach(async a => {
        // check if this account is parent account (if ownerAccountSid == sid, this is parent and should skip)
        if (a.ownerAccountSid != a.sid) {

          // init client for subaccount
          subClient = require('twilio')(a.sid, a.authToken);

          // start loop through date range
           var date = new Date(start);
           while(date <= end){

              const dateFormatted = date.toISOString().split('T')[0];

               // fetch day object from bulk export
               await subClient.bulkexports.v1.exports('Calls')
                .days(dateFormatted)
                .fetch()
                .then(day => {
                    const file = fs.createWriteStream(a.sid + "_" + dateFormatted + ".gz");
                      https.get(day.redirectTo, function(response) {
                       response.pipe(file);
                     });
                });

                // Update date to next day then continue loop
               var newDate = date.setDate(date.getDate() + 1);
               date = new Date(newDate);
           }
       }
   }));

   console.log("Download complete. You should now see all gz files for each day and each account in your directory.");
   console.log("To gunzip the non-empty files and remove the rest, first ensure you do not have any other .gz files in the directory which you do not want to remove, then run command 'gunzip *.gz; rm *.gz' from your terminal in the same directory.");
}

download();
