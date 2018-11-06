const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'direct_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World';
    const serverity = args.length > 0 ? args[0] : 'info';

    ch.assertExchange(ex, 'direct', {durable: false});
    ch.publish(ex, serverity, Buffer.from(msg));
    console.log(` [${serverity}] Sent '${msg}'`);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 100);
});
