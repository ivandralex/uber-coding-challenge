var log = require('../../logger').logger;

var TaskQueue = require('../common/task_queue').TaskQueue;
var util = require('util');

var Promise = require('bluebird').Promise;

var amqp = require('amqplib');

/**
 * Task queue
 */
function RabbitTaskQueue(){
	TaskQueue.call(this);
}

util.inherits(RabbitTaskQueue, TaskQueue);

RabbitTaskQueue.prototype.connect = function(connectStr){
	var self = this;
 	
	return amqp.connect(connectStr).then(function(conn){
		self.conn = conn;

		return self;
	});
}

RabbitTaskQueue.prototype.disconnect = function(){
	if(this.conn){
		this.conn.close();
	}
}

function getChannel(channelId){
	if(this.channels[channelId]){
		return Promise.resolve(this.channels[channelId]);
	}

	var self = this;

	return this.conn.createChannel()
	.then(function(ch){
		self.channels[channelId] = ch;

		log.debug('Created channel')

		//Handle one job at a time
		ch.prefetch(1);
		ch.assertQueue(channelId, {durable: true});

		return ch;
	});
}

RabbitTaskQueue.prototype.enqueue = function(channelId, messageStr){
	getChannel.call(this, channelId)
	.then(function(channel){
		log.debug('Sending to queue', channelId, messageStr);
		channel.sendToQueue(channelId, new Buffer(messageStr), {deliveryMode: true});
	});
}

RabbitTaskQueue.prototype.dequeue = function(channelId, jobHandler){
	var self = this;
	getChannel.call(this, channelId)
	.then(function(channel){
		channel.consume(channelId, function(msg){
			var messageBody = msg.content.toString();

			log.debug('New job', messageBody);

			jobHandler(messageBody, function(err){
				if(!err){
					log.debug('Job acknowledged', messageBody);
					self.channels[channelId].ack(msg);
				}
				else{
					log.debug('nack job', messageBody);
					self.channels[channelId].nack(msg);
				}
			});
		}, {noAck: false});
	});
}

exports.RabbitTaskQueue = RabbitTaskQueue;