const publicIp = require('public-ip');
const Route53 = require('nice-route53');
const r53 = new Route53({
  accessKeyId    : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const ZONEID = process.env.ZONE_ID;
const ANAME = process.env.A_NAME;

r53.records(ZONEID, (err, records) => {
  var record = records.find(r => r.name == ANAME);
  publicIp.v4().then(ip => {
    if (record.values.includes(ip)) {
      console.log('Public IP and ' + ANAME + ' matches ' + ip);
    } else {
      console.log('Updating ' + ANAME + ' with ' + ip);
      var args = {
        zoneId: ZONEID,
        name  : ANAME,
        type  : 'A',
        ttl   : 3600,
        values: [ ip ]
      };
      r53.setRecord(args, (err, res) => {
        var ee = r53.pollChangeUntilInSync(res.changeId, 10);
        ee.on('attempt', changeInfo => {
          console.log('Attempted a poll');
        });
        ee.on('pending', changeInfo => {
          console.log('Still PENDING:', changeInfo);
        });
        ee.on('insync', changeInfo => {
          console.log('Now INSYNC:', changeInfo);
        });
        ee.on('error', err => {
          console.log('Error:', err);
        });
      });
    }
  });
});
