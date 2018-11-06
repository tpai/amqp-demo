const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js <facility>.<serverity>");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'topic_logs';
    ch.assertExchange(ex, 'topic', {durable: false});
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");
      args.forEach(function(key) {
        ch.bindQueue(q.queue, ex, key);
      });
      ch.consume(q.queue, function(msg) {
        console.log(" [%s] Received %s", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    });
  });
});
