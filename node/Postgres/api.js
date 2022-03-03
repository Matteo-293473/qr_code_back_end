const client = require('./connection.js');
const express = require('express');
const bp = require('body-parser');

const app = express();

// dobbiamo usare questi metodi per poter setacciare i dati
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


// ci mettiamo in ascolto nella porta 80
var server = app.listen('80', '192.168.31.107', ()=>{
    var port = server.address().port;
    console.log("Sever in ascolto sulla porta ", port);
});


client.connect();


app.head('/',(req,res)=>{
    client.query('select now()', (err,re)=> {
        if(err) {
            res.status(500).send();
        }else {
            res.status(200).send();
        }
    })
});


app.post('/',(req,res) => {
    //const {id_device} = req.body;
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
                                and orario_entrata IS NOT NULL and orario_uscita IS NULL)`
        // ----------------------------------------------------------------------------

        // Gestione errori --------------------------------------------
        console.log(req.body);
        // Gestione errori
        if (req.body.qrInfo == '') throw new Error('missing qr info');
        if (req.body.id == '') throw new Error('missing device id');
        
        console.log(req.body);

        client.query(checkDevice ,(err,result) => {
            if(err) console.log("errore");
            if(result.rows.length > 0){
                // se siamo qui vuol dire che abbiamo già usato questo dispositivo
                
                client.query(checkQuery,(err,result) => {
                    if(err) console.log("errore");
                    if(result.rows.length > 0){
                        
                        // se siamo qui significa che esiste già una entry ed è la seconda volta 
                        // che stiamo scannerizzando lo stesso qr
                        client.query(alterRowSecondaEntrata, (err,result)=> {
                            if(!err) console.log(err);
                            console.log("inserito seconda volta!");
                            res.send("Seconda scansione 2/2 ✔");
                        });
                    }else{

                        // se siamo qui significa che non esiste un'entry e dobbiamo crearla
                        client.query(insertRowPrimaEntrata,(err,result) => {
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

                client.query(insertRowDevice, (err,result) => {
                    if(err) console.log(err.message);
                    console.log("device inserito!");

                    // ora inseriamo l'entry per la prima volta
                    client.query(insertRowPrimaEntrata,(err,result) => {
                            if(err)  console.log(err.message);
                            console.log("inserito prima volta!");
                            res.send("Registrato device, Prima scansione 1/2 ✔");
                    });
                });
            }
        });

    }
    catch(e)
    {
        console.log(e.message);
        res.send("error " + e.message + " ❌");
    }
    finally{
        client.end;
    }
});