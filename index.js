let async = require('async')
let exportTask = require('./exportTask')
let importTask = require('./importTask')
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second = 0;

var j = schedule.scheduleJob(rule,function () {
	// body...
	exportTask.exportMySQLToTSVProduct(function(err){
		if (err) throw err
		importTask.importProductTable(function(err){
			if (err) throw err
			console.log('dump data from production to WH successfully')
		})
	})
});