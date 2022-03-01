var config = require('./connection');
const sql = require('mssql')

async  function  addEntry(id) {
    try {
        let pool = await sql.connect(config);
        let insertEntry = await pool.request()
        .input('')
    }catch(err){
        console.log(err);
    }
}
