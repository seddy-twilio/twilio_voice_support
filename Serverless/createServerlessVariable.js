const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function rr_init() {
  try {
      // Create Service
      let service = await client.serverless.services
          .create({
              includeCredentials: true,
              uniqueName: 'round-robin-node2',
              friendlyName: 'Round Robin Node2'
          });
      console.log('Service SID is ' + service.sid);

      // Create Environment
      let env = await client.serverless.services(service.sid)
          .environments
          .create({
              domainSuffix: 'prod',
              uniqueName: 'production'
          });
      console.log('Environment SID is ' + env.sid);

      // Create RR Counter Variable
      let ctr = await client.serverless.services(service.sid)
          .environments(env.sid)
          .variables
          .create({key: 'ctr', value: 0});
      console.log('Counter Variable SID is ' + ctr.sid);

    } catch(error) {
      console.error(error);
    }
}

rr_init();
