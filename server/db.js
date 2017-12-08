const mssql = require('mssql');

const config = {
    server: process.env.DBCONN_SERVER,
    database: process.env.DBCONN_DATABASE,
    user: process.env.DBCONN_USER,
    password: process.env.DBCONN_PASSWORD,
    port: 1433,
    options: {
        encrypt: true
    }
};

let conn = mssql.connect(config);

module.exports = conn;