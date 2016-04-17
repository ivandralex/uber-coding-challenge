'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var dal = require('../dal');

dal.init();

dal.getTaskQueue('geo_coding')
.then(function(q){
  console.log('Got queue');

  setInterval(function(){
    q.enqueue('5711044459112c305625d9aa');
  }, 5000);
})
.catch(function(err){
  console.log('Error:', err);
});
