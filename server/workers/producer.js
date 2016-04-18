'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue('open_data_import')
.then(function(q){
  console.log('Got queue');

  setInterval(function(){
    q.enqueue('task');
  }, 5000);
})
.catch(function(err){
  console.log('Error:', err);
});
