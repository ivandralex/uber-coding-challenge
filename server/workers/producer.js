'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue('task_queue')
.then(function(q){
  console.log('Got queue');

  var msg = 0;

  setInterval(function(){
    msg++;
    q.enqueue(msg.toString());
  }, 10);
})
.catch(function(err){
  console.log('Error:', err);
});
