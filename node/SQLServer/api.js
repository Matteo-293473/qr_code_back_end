const sql = require('mssql');
const dbConfig = require('./connection.js');
const express = require('express');
const bp = require('body-parser');

const app = express(); 
 
// dobbiamo usare questi metodi per poter setacciare i dati
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


// ci mettiamo in ascolto nella porta 80
var server = app.listen('80', '192.168.31.107', () => {
    var port = server.address().port;
    console.log("Sever in ascolto sulla porta ", port);
});


//HEAD
app.head('/', function(req , res){
	var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        // Semplice query per verificare la connessione
        request.query("select 1").then(function (resp) {
            console.log("richiesta head");
            res.status(200).send();
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            res.status(500).send();
            dbConn.close();
        });
    }).catch(function (err) {
        res.status(500).send();
        console.log(err);
    });
});


//POST
app.post('/',(req,res) => {
    try {

        // QUERY -----------------------------------------------------------------------
        let checkQuery = `select * from lettura where id_device = '${req.body.id}' 
        and orario_entrata IS NOT NULL and orario_uscita IS NULL and qrInfo='${req.body.qrInfo}'` 
        let checkDevice = `select * from dispositivo where id_device = '${req.body.id}'` 
        // inserimento
        let insertRowDevice = `insert into dispositivo values ('${req.body.id}')` 
        let insertRowPrimaEntrata = `insert into lettura values ('${req.body.id}',CURRENT_TIMESTAMP,NULL,NULL,'${req.body.qrInfo}')` 
        //modifica
        let alterRowSecondaEntrata = `update lettura
        set orario_uscita = CURRENT_TIMESTAMP
        where id_device = '${req.body.id}'
        and orario_entrata = (select orario_entrata from lettura where id_device = '${req.body.id}' 
                                and orario_entrata IS NOT NULL and orario_uscita IS NULL)`
        // ----------------------------------------------------------------------------

        // Gestione errori --------------------------------------------
        if (req.body.qrInfo == '') throw new Error('missing qr info');
        if (req.body.id == '') throw new Error('missing device id');
        // ------------------------------------------------------------

        console.log(req.body);

        var dbConn = new sql.ConnectionPool(dbConfig);
        dbConn.connect(function () {
            var request = new sql.Request(dbConn);
            request.query(checkDevice , (err, resp) => {
                if(err) console.log(err);
                if(resp.recordset.length > 0) {
                    // se siamo qui vuol dire che abbiamo già usato questo dispositivo
                    request.query(checkQuery, (err, resp) => {
                        if(resp.recordset.length > 0){
                            // se siamo qui significa che esiste già una entry ed è la seconda volta
                            // che stiamo scannerizzando lo stesso qr
                            request.query(alterRowSecondaEntrata, (err,resp)=> {
                                if(err) console.log(err);
                                
                                console.log("inserito seconda volta!");
                                res.send("Seconda scansione 2/2 ✔");
                            
                            });
                        }else{

                            // se siamo qui significa che non esiste un'entry e dobbiamo crearla
                            request.query(insertRowPrimaEntrata,(err,result) => {
                                if(err)  console.log(err.message);
                    
                                console.log("inserito prima volta (dispositivo già esistente)!");
                                res.send("Prima scansione 1/2 ✔");
                            
                            });
                        }
                    });
        
                }else{
                    // se siamo qui significa che è la prima volta che scannerizziamo con questo
                    // device
                    console.log("mai usato"); 
                    request.query(insertRowDevice, (err,result) => {
                        if(err) console.log(err.message);
                        console.log("device inserito!");
                        // ora inseriamo l'entry per la prima volta
                        request.query(insertRowPrimaEntrata,(err,result) => {
                            if(err)  console.log(err.message);
                            console.log("inserito prima volta!");
                            res.send("Registrato device, Prima scansione 1/2 ✔");
                        });
                    });
                }
            });

        });
    }catch(e){
        console.log(e.message);
        res.send("error " + e.message + " ❌");
    }
})
