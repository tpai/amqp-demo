const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'topic_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World';
    const key = args.length > 0 ? args[0] : 'web.info';

    ch.assertExchange(ex, 'topic', {durable: false});
    ch.publish(ex, key, Buffer.from(msg));
    console.log(` [${key}] Sent '${msg}'`);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 100);
});
