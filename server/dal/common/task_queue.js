/**
 * Base task queue. 
 */
function TaskQueue(){
	this.channels = {};
}

TaskQueue.prototype.connect = function(connectStr){
	throw 'Not implemented!';
}

TaskQueue.prototype.disconnect = function(){
	throw 'Not implemented!';
}

TaskQueue.prototype.enqueue = function(channelId, messageStr){
	throw 'Not implemented!';
}

TaskQueue.prototype.dequeue = function(channelId, jobHandler){
	throw 'Not implemented!';
}

exports.TaskQueue = TaskQueue;