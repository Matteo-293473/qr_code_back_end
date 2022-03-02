
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express(); 
 
// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());
 
//Setting up server
 var server = app.listen(1433, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });


 //Initializing connection string
var dbConfig = {
    user:  "SQLserver",
    password: "sqlserver123",
    server: "localhost",
    database: "qrApp"
};

//GET API
app.get("/api/v1/employee", function(req , res){
	getEmployees()
});
function getEmployees() {
    var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        request.query("select * from employee").then(function (resp) {
            console.log(resp);
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}

//GET API
app.head('/', function(req , res){
	testConnection()
});

function testConnection() {
    var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        request.query("CALL NOW()").then(function (resp) {
            console.log(resp);
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}