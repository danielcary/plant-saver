const mssql = require('mssql');

const config = {
    server: "",
    database: "",
    user: "",
    password: "",
    port: 1433,
    options: {
        encrypt: true
    }
};

//let conn = mssql.connect(config);

//module.exports = conn;