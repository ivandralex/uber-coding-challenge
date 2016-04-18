'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue()
.then(function(q){
  console.log('Got queue');

  q.dequeue('open_data_import', function(msg, ack){
    console.log('Processing', msg);

    ack();
  });
})
.catch(function(err){
  console.log('Error:', err);
});
