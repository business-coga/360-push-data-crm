const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const {
	writeToPath
} = require('@fast-csv/format');
const axios = require('axios');
const data_path = './data.csv';
const FormData = require('form-data');
const form = new FormData();
const {query,pageSize} = require('./src/config')
const conn = require('./src/connect')

let data = []
let rowCount = 0

// fs.createReadStream(path.resolve(__dirname, 'data2.csv'))
// 	.pipe(csv.parse({
// 		headers: true
// 	}))
// 	.on('error', error => console.error(error))
// 	.on('data', row => data.push(row))
// 	.on('end', rowCount => {
// 		writeToPath(path.resolve(__dirname, 'tmp.csv'), data, {
// 				headers: true,

// 			})
// 			.on('error', err => console.error(err))
// 			.on('finish', () => {
// 				console.log('Done writing.')

				
// 			});
// 	});

async function main(){
	try {
		console.log("--------Start Process--------")
		let pageCount = 0
		let {rows} = await conn.query(query.getPageProfile(pageSize))
		pageCount = rows[0].PAGE_COUNT
		console.log(`Total page : ${pageCount}`)
		for(let i=0; i<pageCount; i++){
			console.log(`--------${i+1}--------`)
			let {rows} = await conn.query(query.getProfileByPagination(pageSize,i))
			let status = await createFileCSV(rows,`data${i+1}.csv`)
			if(status){
				console.log(`Done writing data${i+1}.csv`)
				let res = await sendDataToCRM(`data${i+1}.csv`)
				if(res){
					console.log(res)
				}
			}
		}
		console.log("--------Done Process--------")
		conn.end()
		process.exit()
	} catch (error) {
		console.log(error)
	} 
}

function createFileCSV(data,fileName){
	return new Promise(function(resolve, reject) {
		writeToPath(path.resolve(__dirname, `file/${fileName}`), data, {headers: true,})
		.on('error', err => {console.error(err), reject(err)})
		.on('finish', () => {
			resolve(true)
		});
	})
}

async function sendDataToCRM(fileName){
	console.log(`Send file ${fileName} to CRM ...`)
	return new Promise(function(resolve, reject) {
		const config = {
			method: 'post',
			url: 'https://tnhoic-axjfjpswtig9-px.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/CONTACT_BATCH/1.0/Contact',
			headers: { 
			  'Content-Type': 'application/octet-stream', 
			},
			auth: {
				username: "abhishekgarg",
				password: "InnovacxOIC@2020"
			},
			encoding: null,
			data : fs.createReadStream(path.resolve(__dirname, `file/${fileName}`))
		  };
		
		axios(config)
		.then(function (response) {
		  resolve(JSON.stringify(response.data))
		})
		.catch(function (error) {
		  console.log(error);
		  reject(error)
		});
	})
}


main()
//https://stackoverflow.com/questions/48994269/nodejs-send-binary-data-with-request

	

	
