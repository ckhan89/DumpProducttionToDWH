var converter = require('json-2-csv');
var jsonfile = require('jsonfile')
let fs = require('fs')
let async = require('async')
let hostMySQL = '118.69.73.196'
let portMySQL = 3333
let userMySQL = "team1"
let passMySQL = "176P4a5218o$UTP1yb09"
var mysql      = require('mysql');

let productJsonFile 		= './product.json'
let sellingOrderJsonFile 	= './selling_order.json'
let sellingStoreJsonFile 	= './selling_store.json'
let userJsonFile 			= './user.json'
let videoJsonFile 			= './video.json'

let productJsonFileCopy 		= './product_copy.json'
let sellingOrderJsonFileCopy 	= './selling_order_copy.json'
let sellingStoreJsonFileCopy 	= './selling_store_copy.json'
let userJsonFileCopy 			= './user_copy.json'
let videoJsonFileCopy 			= './video_copy.json'


var writeJsonFile = function (sqlSequence,filejson,filejsonCopy,callback) {
	var connection = mysql.createConnection({
	  host     : hostMySQL,
	  port     : portMySQL,
	  user     : userMySQL,
	  password : passMySQL,
	  database : 'svcdb',
	});
	var asyncTasks =[]
	var productArray
	connection.connect()
	asyncTasks.push(function(callback){
		connection.query(sqlSequence,function(err,rows,fields){
			connection.end()
			if (err) callback(err,null)
			productArray = JSON.stringify(rows)
			callback(null,productArray)
		})
	})
	async.parallel(asyncTasks,function(err,results){
		if (err) callback(err)
		fs.exists(filejsonCopy,function(exists){
			if(exists){
				fs.unlinkSync(filejsonCopy)
			}

			jsonfile.writeFile(filejsonCopy,JSON.parse(productArray),function(error){
				if (error) callback(error)
				fs.exists(filejson,function(exists){
					if(exists){
						fs.unlinkSync(filejson)
					}
					fs.rename(filejsonCopy,filejson,function(err){
							callback(err)
					})
				})
			})
		})
	})
}

module.exports.exportMySQLToTSVProduct = function exportMySQLToTSVProduct(callback){
	var taskList = []
	taskList.push(function(callback1){
		writeJsonFile('SELECT * FROM product',productJsonFile,productJsonFileCopy,function(err){
			return callback1(err)
		})
	})

	taskList.push(function(callback1){
		writeJsonFile('SELECT * FROM selling_order',sellingOrderJsonFile,sellingOrderJsonFileCopy,function(err){
			return callback1(err)
		})
	})

	taskList.push(function(callback1){
		writeJsonFile('SELECT * FROM selling_store',sellingStoreJsonFile,sellingStoreJsonFileCopy,function(err){
			return callback1(err)
		})
	})

	taskList.push(function(callback1){
		writeJsonFile('SELECT * FROM user',userJsonFile,userJsonFileCopy,function(err){
			return callback1(err)
		})
	})

	taskList.push(function(callback1){
		writeJsonFile('SELECT * FROM video',videoJsonFile,videoJsonFileCopy,function(err){
			return callback1(err)
		})
	})

	async.series(taskList,function(error,results){
		callback(error)
	})
}