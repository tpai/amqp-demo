const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) console.log(err);
  conn.createChannel(function(err, ch) {
    const q = 'rpc_queue';
    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function(msg) {
      const n = parseInt(msg.content.toString(), 10);
      console.log(` [.] fib(${n})`);

      const x = fibonacci(n);

      ch.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(x.toString()),
        {correlationId: msg.properties.correlationId},
      );
      ch.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}
