let async = require('async')
let fs = require('fs')
let jsonfile = require('jsonfile')
var converter = require('json-2-csv');
let pgp = require('pg-promise')();
var cn = {
  database: 'han', //env var: PGDATABASE
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 1, // how long a client is allowed to remain idle before being closed
};
var db = pgp(cn)

let schemaProd = require('./schemaProd')

function Inserts(template, data) {
    if (!(this instanceof Inserts)) {
        return new Inserts(template, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return data.map(d=>'(' + pgp.as.format(template, d) + ')').join();
    };
}

var createTable = function (schema,tableName,fakeTableName,template,filePath, callback) {
	var insertTask = function(){
		jsonfile.readFile(filePath,function(error,jsonArray){
	  			if (error) return callback(error)
	  			var values = new Inserts(template, jsonArray)
	  			let qformat = 'INSERT INTO '+fakeTableName+' VALUES $1'
	  			db.none(qformat,values)
	  			   .then(data=>{
	  			   	swaptable(tableName,fakeTableName,callback)
	  			   })
	  			   .catch(error=>{
	  			   	return callback(error)
	  			   })
	  		});
	}
	db.none('DROP TABLE IF EXISTS ' + fakeTableName)
	  	.then(function(){
	  		db.none(schema)
	  			.then(function(){
	  				insertTask()
	  			})
	  			.catch(function(error){
	  				return callback(error)
	  			})
	  	})
	  	.catch(function(error){
	  		return callback(error)
	  	})
}

function swaptable(tableName1,tableName2,callback)
{
	let querySequence = 'BEGIN;\
						DROP TABLE IF EXISTS ' + tableName1+'; \
						ALTER TABLE '+tableName2+' RENAME TO '+ tableName1 + ';\
						COMMIT;'
	db.none(querySequence)
		.then(data=>{
			return callback(null)
		})
		.catch(error=>{
			return callback(error)
		})
}

let productTable 		= 'product'
let sellingOrderTable 	= 'selling_order'
let sellingStoreTable 	= 'selling_store'
let userTable 			= 'user_res'
let videoTable 			= 'video'

let fakeProductTable 		= 'product_fake'
let fakeSellingOrderTable 	= 'selling_order_fake'
let fakeSellingStoreTable 	= 'selling_store_fake'
let fakeUserTable 			= 'user_fake'
let fakeVideoTable 			= 'video_fake'

let productJsonFile 		= './product.json'
let sellingOrderJsonFile 	= './selling_order.json'
let sellingStoreJsonFile 	= './selling_store.json'
let userJsonFile 			= './user.json'
let videoJsonFile 			= './video.json'

module.exports.importProductTable = function importProductTable(callback){
	var taskList = []
	taskList.push(function(callback){
		createTable(schemaProd.productSchema,productTable,fakeProductTable,schemaProd.productTempale,productJsonFile,callback)
	})
	taskList.push(function(callback){
		createTable(schemaProd.sellingOrderSchema,sellingOrderTable,fakeSellingOrderTable,schemaProd.sellingOrderTempale,sellingOrderJsonFile,callback)
	})
	taskList.push(function(callback){
		createTable(schemaProd.sellingStoreSchema,sellingStoreTable,fakeSellingStoreTable,schemaProd.sellingStoreTempale,sellingStoreJsonFile,callback)
	})
	taskList.push(function(callback){
		createTable(schemaProd.userSchema,userTable,fakeUserTable,schemaProd.userTempalate,userJsonFile,callback)
	})
	taskList.push(function(callback){
		createTable(schemaProd.videoSchema,videoTable,fakeVideoTable,schemaProd.videoTempalate,videoJsonFile,callback)
	})
	async.series(taskList, function(error,results){
		return callback(error)
	})
}