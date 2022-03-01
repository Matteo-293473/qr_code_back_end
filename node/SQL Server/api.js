const sql = require('mssql')
const config = require('./connection.js');
const express = require('express');

const app = express();

app.listen('80', '192.168.31.107', ()=>{
   console.log("Sever in ascolto sulla porta 80");
})

//https://www.youtube.com/watch?v=ReK0kscoF8o&ab_channel=FaztCode

app.head('/',(req,res)=>{
   try {
      // make sure that any items are correctly URL encoded in the connection string
      sql.connect(config);
      const result = sql.query`select * from devices `
      console.dir(result)
      res.status(200).end();
     } catch (err) {
      res.status(500).end();
     }
})



// async () => {
//    try {
//     // make sure that any items are correctly URL encoded in the connection string
//     await sql.connect(config)
//     const result = await sql.query`select * from devices `
//     console.dir(result)
//    } catch (err) {
//     // ... error checks
//    }
// }






// router.use((request,response,next)=>{
//    console.log('middleware');
//    next();
// })

// router.route('/orders').get((request,response)=>{

//     dboperations.getOrders().then(result => {
//        response.json(result[0]);
//     })

// })

// router.route('/orders/:id').get((request,response)=>{

//     dboperations.getOrder(request.params.id).then(result => {
//        response.json(result[0]);
//     })

// })

// router.route('/orders').post((request,response)=>{

//     let order = {...request.body}

//     dboperations.addOrder(order).then(result => {
//        response.status(201).json(result);
//     })

// })