const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const ex = 'logs';
    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
      ch.bindQueue(q.queue, ex, '');
      ch.consume(q.queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
      }, {noAck: true});
    });
  });
});
