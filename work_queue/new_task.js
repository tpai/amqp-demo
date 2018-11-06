const amqp = require('amqplib/callback_api');
const msg = process.argv.slice(2).join(' ') || "Hello World!";

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const q = 'task_queue';
    ch.assertQueue(q, {durable: true});
    ch.sendToQueue(q, Buffer.from(msg), {persistent: true});
    console.log(" [x] Sent 'Hello World!'");
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 100);
});
