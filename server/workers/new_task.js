var amqp = require('amqplib');

var intervalId;

amqp.connect('amqp://localhost').then(function(conn){
  //Close on process exit
  process.once('SIGINT', function() {
    console.log('Closing connection');
    clearInterval(intervalId);
    conn.close(); 
  });

  conn.createChannel().then(function(ch) {
    var q = 'task_queue';
    var ok = ch.assertQueue(q, {durable: true});
    
    return ok.then(function() {
      var msg = 0;

      intervalId = setInterval(function(){
        msg++;
        console.log('Write message', msg)
        ch.sendToQueue(q, new Buffer(msg.toString()), {deliveryMode: true});  
      }, 1000);
    });
  });
}).then(null, console.warn);