'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue()
.then(function(q){
  console.log('Got queue');

  setInterval(function(){
    q.enqueue('open_data_import', 'task');
  }, 1000);
})
.catch(function(err){
  console.log('Error:', err);
});
