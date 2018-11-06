const amqp = require('amqplib/callback_api');
const msg = process.argv.slice(2).join(' ') || "Hello World!";

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'logs';
    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.publish(ex, '', Buffer.from(msg));
    console.log(" [x] Sent 'Hello World!'");
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 100);
});
