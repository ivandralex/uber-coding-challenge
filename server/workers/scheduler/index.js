'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var log = require('../../logger').logger;
var config = require('../../config/environment');
var dal = require('../../dal');

log.info('Starting scheduler');

//Initialize DAL
dal.init();

function checkLastImport(){
	log.debug('Checking last import time');
	dal.getLastImportJournalRecord()
	.then(function(record){
		if(record && record.time){
			var sinceLastImport = (new Date()).getTime() - record.time.getTime();
			var diff = config.workers.openData.updatePeriodMs - sinceLastImport;

			log.debug('Since last import', sinceLastImport, diff)

			if(diff > 0){
				log.info('Will start new import in %s ms', diff);

				setTimeout(addImportJob, diff);	
			}
			else{
				addImportJob();
			}
		}
		else{
			log.debug('No records found!');
			addImportJob();
		}
	})
	.catch(function(err){
	  log.error('Error:', err);
	});
}

/**
 * Add data import task to queue.
 */
function addImportJob(){
	//Get queue
	return dal.getTaskQueue()
	.then(function(queue){
		//Setup job handler
	  	return queue.enqueue(config.workers.openData.channelId, 'job')
	  	.then(queue.disconnect)
	})
	.then(function(){
		return dal.saveImportJournalRecord({time: new Date()});
	})
	.then(checkLastImport);
}

checkLastImport();