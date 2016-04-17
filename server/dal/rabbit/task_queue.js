var log = require('../../logger').logger;

var TaskQueue = require('../common/task_queue').TaskQueue;
var util = require('util');

var amqp = require('amqplib');

/**
 * Task queue
 */
function RabbitTaskQueue(){
	TaskQueue.call(this);
}

util.inherits(RabbitTaskQueue, TaskQueue);

RabbitTaskQueue.prototype.connect = function(connectString, channelId){
	this.channelId = channelId;

	var self = this;
 	
	return amqp.connect(connectString).then(function(conn){
		self.conn = conn;

		return conn.createChannel()
		.then(function(ch){
			self.channel = ch;

			//Handle one job at a time
			ch.prefetch(1);

			log.info('Connected to \'%s\' channel on %s', channelId, connectString);

			return ch.assertQueue(channelId, {durable: true});
		});
	});
}

RabbitTaskQueue.prototype.disconnect = function(){
	if(this.conn){
		this.conn.close();
	}
}

RabbitTaskQueue.prototype.enqueue = function(messageStr){
	this.channel.sendToQueue(this.channelId, new Buffer(messageStr), {deliveryMode: true});  
}

RabbitTaskQueue.prototype.dequeue = function(jobHandler){
	var self = this;
	this.channel.consume(this.channelId, function(msg){
		var messageBody = msg.content.toString();

		log.debug('New job', messageBody);

		jobHandler(messageBody, function(err){
			if(!err){
				log.debug('Job acknowledged', messageBody);
				self.channel.ack(msg);
			}
			else{
				log.debug('nack job', messageBody);
				self.channel.nack(msg);
			}
		});
	}, {noAck: false});
}

exports.RabbitTaskQueue = RabbitTaskQueue;