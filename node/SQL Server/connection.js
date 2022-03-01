const sql = require('mssql');

var config = {
    user :'SQLserver',
    password :'sqlserver123',
    server:'localhost',  // DESKTOP-BAQ5IL4
    database:'qrApp',
    options:{
        trustedconnection: true,
        enableArithAbort : true, 
        instancename :'SQLEXPRESS'
    },
    port : 1433
}

async function getConnection(){
    const pool = await sql.connect(config);
    const result = await pool.request().query('select 1');
    console.log(result);
}

getConnection();

module.exports = config; 