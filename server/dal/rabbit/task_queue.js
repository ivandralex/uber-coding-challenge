var log = require('../../logger').logger;

var TaskQueue = require('../common/task_queue').TaskQueue;
var util = require('util');

var amqp = require('amqplib');

/**
 * Task queue. Provides 
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

			log.info('Connected to', channelId, 'on', connectString);

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

RabbitTaskQueue.prototype.onJob = function(jobHandler){
	var self = this;
	this.channel.consume(this.channelId, function(msg){
		var messageBody = msg.content.toString();

		jobHandler(messageBody, function(err){
			if(!err){
				self.channel.ack(msg);
			}
		});
	}, {noAck: false});
}

exports.RabbitTaskQueue = RabbitTaskQueue;