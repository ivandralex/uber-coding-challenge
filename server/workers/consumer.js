'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue('task_queue')
.then(function(q){
  console.log('Got queue');

  q.onJob(function(msg, ack){
    console.log('Processing', msg);

    ack();
  });
})
.catch(function(err){
  console.log('Error:', err);
});
