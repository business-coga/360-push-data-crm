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

function getData(){

}


sendDataToCRM('temp.csv')


function sendDataToCRM(fileName){
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
	let start = new Date()
	console.log(start)
	axios(config)
	.then(function (response) {
		console.log((new Date()) - start)
	  console.log(JSON.stringify(response.data));
	})
	.catch(function (error) {
	  console.log(error);
	});
}


	//https://stackoverflow.com/questions/48994269/nodejs-send-binary-data-with-request

	

	
