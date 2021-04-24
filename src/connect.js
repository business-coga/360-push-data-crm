const {
    Pool
} = require('pg')

const conn = new Pool({
    user: 'postgres',
    host: '10.254.61.68',
    database: 'cus360',
    password: '123456789',
    port: 5432,
})

conn.connect((err)=>{
    if(err)
        throw err
    console.log('DB connected!')
})

// conn.query(require('./config').query.getPageProfile(10000), (err,data)=>{
//     console.log({err,data : data.rows})
// })

module.exports = conn