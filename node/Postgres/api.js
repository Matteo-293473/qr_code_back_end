// librerie
const client = require('./connection.js');
const express = require('express');
const bp = require('body-parser');
const cors = require("cors");

const app = express();

// dobbiamo usare questi metodi per poter setacciare i dati
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors()); // serve per poter accedere da browser

// ci mettiamo in ascolto nella porta 80
var server = app.listen('80', '192.168.31.107', ()=>{
    var port = server.address().port;
    console.log("Sever in ascolto sulla porta ", port);
});


client.connect();

// HEAD
app.head('/',(req,res)=>{
    // verifica della connessione
    client.query('select now()', (err,re)=> {
        if(err) {
            res.status(500).send();
        }else {
            res.status(200).send();
        }
    })
});

// POST
app.post('/',(req,res) => {
    try
    {
        // QUERY -----------------------------------------------------------------------
        // selezione
        let checkQuery = `select * from lettura where id_device = '${req.body.id}' 
        and orario_entrata IS NOT NULL and orario_uscita IS NULL and qrInfo='${req.body.qrInfo}'`
        let checkDevice = `select * from dispositivo where id_device = '${req.body.id}'`
        // inserimento
        let insertRowDevice = `insert into dispositivo values ('${req.body.id}')`
        let insertRowPrimaEntrata = `insert into lettura values ('${req.body.id}',now(),NULL,NULL,'${req.body.qrInfo}')`
        //modifica
        let alterRowSecondaEntrata = `update lettura
        set orario_uscita = now()
        where id_device = '${req.body.id}'
        and orario_entrata = (select orario_entrata from lettura where id_device = '${req.body.id}' 
                              and orario_entrata IS NOT NULL and orario_uscita IS NULL and qrInfo = '${req.body.qrInfo}')`
        // ----------------------------------------------------------------------------

        // Gestione errori --------------------------------------------
        if (req.body.qrInfo == '') throw new Error('missing qr info');
        if (req.body.id == '') throw new Error('missing device id');
        // ------------------------------------------------------------

        console.log(req.body);

        // invio delle query
        client.query(checkDevice ,(err,result) => {
            if(err) console.log("errore");
            if(result.rows.length > 0){
                // se siamo qui vuol dire che abbiamo gi?? usato questo dispositivo
                
                client.query(checkQuery,(err,result) => {
                    if(err) console.log("errore");
                    if(result.rows.length > 0){
                        
                        // se siamo qui significa che esiste gi?? una entry ed ?? la seconda volta 
                        // che stiamo scannerizzando lo stesso qr
                        client.query(alterRowSecondaEntrata, (err,result)=> {
                            if(!err) console.log(err);
                            console.log("inserito seconda volta!");
                            res.send("Second scan 2/2 ???");
                        });
                    }else{

                        // se siamo qui significa che non esiste un'entry e dobbiamo crearla
                        client.query(insertRowPrimaEntrata,(err,result) => {
                            if(err)  console.log(err.message);
                            console.log("inserito prima volta (dispositivo gi?? esistente)!");
                            res.send("First scan 1/2 ???");
                        });
                    }
                });

            }else{

                // se siamo qui significa che ?? la prima volta che scannerizziamo con questo
                // device
                console.log("mai usato"); 

                client.query(insertRowDevice, (err,result) => {
                    if(err) console.log(err.message);
                    console.log("device inserito!");

                    // ora inseriamo l'entry per la prima volta
                    client.query(insertRowPrimaEntrata,(err,result) => {
                            if(err)  console.log(err.message);
                            console.log("inserito prima volta!");
                            res.send("Device has been registered, first scan 1/2 ???");
                    });
                });
            }
        });

    }
    catch(e)
    {
        // stampa e risposta di eventuali errori
        console.log(e.message);
        res.send("error " + e.message + " ???");
    }
    finally{
        // chiudo la connessione al server
        client.end;
    }
});