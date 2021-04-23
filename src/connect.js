const {
    Pool
} = require('pg')

const conn = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
})

conn.connect((err)=>{
    if(err)
        throw err
    console.log('DB connected!')
})

module.exports = conn