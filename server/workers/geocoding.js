var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost', port: 5672 });

// Wait for connection to become established.
connection.on('ready', function () {
  console.log('Connection ready');
  // Use the default 'amq.topic' exchange
  connection.queue('my-queue', function (q) {
      console.log('Connection ready');
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        // Print messages to stdout
        console.log(message);
      });
  });
});