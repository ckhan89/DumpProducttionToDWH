
function replaceAll(string, subString)
{
	while(string.indexOf(subString) !== -1)
	{
		string = string.replace(subString,'')
	}
	return string;
}
// function replaceAll(string, subString, replaceString)
// {
// 	while(string.indexOf(subString) !== -1)
// 	{
// 		string = string.replace(subString,replaceString)
// 	}
// 	return string;
// }

module.exports = {
	productSchema: 'CREATE TABLE product_fake \
	(\
	  product_id varchar,\
	  name varchar ,\
	  description varchar,\
	  status smallint ,\
	  creation_time timestamp,\
	  update_time timestamp,\
	  price int,\
	  product_type varchar ,\
	  brand varchar ,\
	  subcategory varchar,\
	  category varchar,\
	  store_id int  \
  	)',
  	sellingOrderSchema: 'CREATE TABLE selling_order_fake (\
  	order_id bigint,\
  	product_id varchar,\
  	customer_id bigint,\
  	order_date timestamp,\
  	quantity int,\
  	revenue bigint,\
  	discount float )',
  	sellingStoreSchema: 'CREATE TABLE selling_store_fake (\
  	store_id bigint,\
  	name varchar,\
	user_id bigint,\
	location varchar )',
	userSchema: 'CREATE TABLE user_fake (\
	user_id bigint,\
	name varchar,\
	age integer,\
	gender integer,\
	location varchar,\
	creation_date timestamp,\
	modification timestamp )',
	videoSchema: 'CREATE TABLE video_fake (\
	video_id varchar,\
	url varchar,\
	category varchar,\
	title varchar,\
	description varchar,\
	thumbnail_image varchar,\
	published_time timestamp,\
	channel_id varchar,\
	channel_title varchar,\
	product_id varchar )',
  	productTempale: '${product_id},${name},${description},${status},${creation_time},${update_time},\
  					${price},${product_type},${brand},${subcategory},${category},${store_id}',

 	sellingOrderTempale: '${order_id},${product_id},${customer_id},${order_date},${quantity},${revenue},\
 						${discount}',
 	sellingStoreTempale : '${store_id},${name},${user_id},${location}',
    userTempalate: '${user_id},${name},${age},${gender},${location},${creation_date},${modification}',
    videoTempalate: '${video_id},${url},${category},${title},${description},${thumbnail_image},\
    					${published_time},${channel_id},${channel_title},${product_id}',
	insertTableTempale: function (tempale) {
		var t = replaceAll(tempale,'$')
		t = replaceAll(t,'{')
		t = replaceAll(t,'}')
		console.log(t)
		return t.split(',');
	}

}