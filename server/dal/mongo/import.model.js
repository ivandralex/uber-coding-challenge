'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImportScheduleJournalSchema = new Schema({
	time: Date
});

module.exports = mongoose.model('ImportScheduleJournal', ImportScheduleJournalSchema);