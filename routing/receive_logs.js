const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'direct_logs';
    ch.assertExchange(ex, 'direct', {durable: false});
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");
      args.forEach(function(serverity) {
        ch.bindQueue(q.queue, ex, serverity);
      });
      ch.consume(q.queue, function(msg) {
        console.log(" [%s] Received %s", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    });
  });
});
