//Initializing connection string
var dbConfig = {
    user:  "SQLserver",
    password: "sqlserver123",
    server: "localhost",
    database: "qrApp",
    port: 1433,
    options: {
      trustedConnection: true,
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
 };

module.exports = dbConfig