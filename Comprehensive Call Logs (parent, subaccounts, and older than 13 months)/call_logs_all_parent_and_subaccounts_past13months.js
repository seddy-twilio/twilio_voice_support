const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken);

// list past 13 months of calls in parent account
client.calls.list().then(calls => {

  // Print parent account label
  console.log("\n--- Parent account: " + accountSid + " --- ");

  // For each call, do the following
  calls.forEach(i => {
          // print logs fields
          console.log("Called: " + i.to + ", " + "Caller: " + i.from + ", " + "Date Created :" + i.dateCreated + ", " + "Duration :" + i.duration + ", " +"Price :" + i.price + ", " + "Call SID :" + i.sid + ", " + "Call Status :" + i.status);
      });

    // fetch all accounts / subaccounts
    client.api.accounts.list()
      .then(accounts => accounts.forEach(a => {
        // check if this account is parent account (if ownerAccountSid == sid, this is parent and should skip)
        if (a.ownerAccountSid != a.sid) {

          // init client for subaccount
          subClient = require('twilio')(a.sid, a.authToken);

          // list past 13 months of calls for subaccount
          subClient.calls.list().then(calls => {

            // print subaccount sid
            console.log("\n--- Subaccount: " + a.sid + " ---");

            // For each call, do the following
            calls.forEach(i => {
                    // print logs fields
              console.log("Called: " + i.to + ", " + "Caller: " + i.from + ", " + "Date Created :" + i.dateCreated + ", " + "Duration :" + i.duration + ", " +"Price :" + i.price + ", " + "Call SID :" + i.sid + ", " + "Call Status :" + i.status);
                });
            });
    }}));
  });