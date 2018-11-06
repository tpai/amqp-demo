const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: client.js <num>");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      const uuid = generateUuid();
      const num = parseInt(args[0], 10);
      console.log(` [x] Requesting fib(${num})`);
      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId === uuid) {
          console.log(` [.] Got ${msg.content.toString()}`);
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});
      ch.sendToQueue(
        'rpc_queue',
        Buffer.from(num.toString()),
        {correlationId: uuid, replyTo: q.queue},
      );
    });
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 100);
});

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}
