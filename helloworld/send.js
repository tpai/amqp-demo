const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const q = 'hello';
    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    setInterval(() => {
      ch.sendToQueue(q, new Buffer('Hello World!'));
    }, 1000);
    console.log(" [x] Sent 'Hello World!'");
  });
});
