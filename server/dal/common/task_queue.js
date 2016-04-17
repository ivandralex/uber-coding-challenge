/**
 * Base task queue. 
 */
function TaskQueue(){
}

TaskQueue.prototype.connect = function(connectString, channelId){
	throw 'Not implemented!';
}

TaskQueue.prototype.disconnect = function(){
	throw 'Not implemented!';
}

TaskQueue.prototype.enqueue = function(messageStr){
	throw 'Not implemented!';
}

TaskQueue.prototype.dequeue = function(jobHandler){
	throw 'Not implemented!';
}

exports.TaskQueue = TaskQueue;